import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // or use native fetch in node 18+
import dotenv from 'dotenv';
import { pipeline } from 'stream/promises';

dotenv.config();

// 1. Setup APIs
const driveAuth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth: driveAuth });

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const TEMP_DIR = path.join(process.cwd(), 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// Utility: Stream from Drive to Local Temp File
async function downloadToTemp(fileId, filePath) {
  console.log(`Downloading ${fileId} -> ${filePath}`);
  const dest = fs.createWriteStream(filePath);
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  await pipeline(res.data, dest);
  return filePath;
}

// Utility: Upload to Gemini API & wait for ACTIVE
async function uploadToGeminiAndWait(filePath, mimeType) {
  console.log(`Uploading ${filePath} to Gemini Cloud...`);
  const uploadResult = await fileManager.uploadFile(filePath, { mimeType, displayName: path.basename(filePath) });
  let file = await fileManager.getFile(uploadResult.file.name);
  
  console.log(`Waiting for ${file.name} to become ACTIVE...`);
  while (file.state === 'PROCESSING') {
    process.stdout.write('.');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    file = await fileManager.getFile(uploadResult.file.name);
  }
  process.stdout.write('\n');
  if (file.state !== 'ACTIVE') throw new Error(`File processing failed: ${file.state}`);
  return uploadResult.file;
}

async function findVideoRecursively(drive, folderId) {
  // Check for video directly
  const res = await drive.files.list({ q: `'${folderId}' in parents and mimeType contains 'video/mp4' and trashed = false`, fields: 'files(id, name)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true });
  if (res.data.files && res.data.files.length > 0) return res.data.files[0];
  
  // Recursively check subfolders
  const sub = await drive.files.list({ q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false`, fields: 'files(id, name)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true });
  if (sub.data.files) {
    for (let f of sub.data.files) {
      let vid = await findVideoRecursively(drive, f.id);
      if (vid) return vid;
    }
  }
  return null;
}

async function analyzeBuilding(buildingId, buildingName, melonyFile, promptText) {
  try {
     // A. Search inside the building folder specifically for "pxl.mp4"
     const vidFile = await findVideoRecursively(drive, buildingId);
     if (!vidFile) return `### ${buildingName}\nNO VIDEO FOUND.\n\n`;
     
     const localVidPath = path.join(TEMP_DIR, `${buildingName}_video.mp4`);
     await downloadToTemp(vidFile.id, localVidPath);

     // B. Upload to Gemini 
     const geminiVid = await uploadToGeminiAndWait(localVidPath, 'video/mp4');

     // C. Wipe local disk copy
     fs.unlinkSync(localVidPath); // wipe immediately to save disk

     // Analyze
     const model = ai.getGenerativeModel({ model: 'gemini-3.1-pro-preview' });
     console.log(`Analyzing ${buildingName}...`);
     const response = await model.generateContent([
       { fileData: { mimeType: melonyFile.mimeType, fileUri: melonyFile.uri } },
       { fileData: { mimeType: geminiVid.mimeType, fileUri: geminiVid.uri } },
       { text: promptText }
     ]);

     // D. Delete from Gemini Cloud to save quota automatically
     await fileManager.deleteFile(geminiVid.name);
     console.log(`Cleaned up Gemini Cloud footprint for ${buildingName}.`);

     return `### ${buildingName}\n${response.response.text()}\n\n`;
   } catch (err) {
     console.error(`Error analyzing ${buildingName}:`, err.message);
     return `### ${buildingName}\nANALYIS ERROR: ${err.message}\n\n`;
   }
}

async function runInspector() {
  try {
    const PROP_FOLDER_ID = process.env.PROPERTY_FOLDER_ID;
    
    // 0. Locate audio call
    console.log("Locating Melony's Call...");
    const audioRes = await drive.files.list({
      q: `'${PROP_FOLDER_ID}' in parents and mimeType contains 'audio' and trashed=false`, // simple heuristic
      fields: 'files(id, name, mimeType)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true
    });
    
    if (audioRes.data.files.length === 0) throw new Error("Could not find Melony's audio call.");
    const audioFile = audioRes.data.files[0];
    
    const localAudioPath = path.join(TEMP_DIR, 'melony_call.mp3');
    await downloadToTemp(audioFile.id, localAudioPath);
    const geminiAudio = await uploadToGeminiAndWait(localAudioPath, audioFile.mimeType);
    console.log(`Melony call uploaded. URI: ${geminiAudio.uri}`);

    // 1. Locate Buildings
    console.log(`\nScanning Property Folder for Buildings...`);
    const bldingsRes = await drive.files.list({
      q: `'${PROP_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true
    });
    const buildings = bldingsRes.data.files.filter(f => f.name.toLowerCase().includes('bld'));
    console.log(`Found ${buildings.length} building folders.`);

    const BASE_PROMPT = `
      You are a Senior Project Manager and Building Inspector for RHive Construction.
      Task: Output a Building Condition Summary.
      Context: Listen to the attached HOA Manager Call mapping expectations.
      Instructions: 
      1. Watch the attached video. Transcribe the audio and identify specific roof or building defects.
      2. Categorize this building into: [Replacement Quote Required], [Repair Quote Required], or [5-Year System Service Agreement].
      3. For any Service Agreement or recommendation, you MUST mention: "Includes reconditioning the asphalt and granules to extend adhesion and UV as well as watershedding." (DO NOT mention clear spray sealer).
      4. CRITICAL: Analyze the video to determine if the Ice & Water shield is located UNDER or OVER the drip edge. You must state this explicitly and cite the video footage.
      Format as a concise Markdown summary identifying defects, recommendation, the drip edge condition, and a brief rationale.
    `;

    let finalReport = `# Mountain View Estates - Condition & Proposal Report\n\n`;
    fs.writeFileSync('Mountain_View_Estates_Proposal.md', finalReport);

    for (const bld of buildings) {
      const summary = await analyzeBuilding(bld.id, bld.name, geminiAudio, BASE_PROMPT);
      fs.appendFileSync('Mountain_View_Estates_Proposal.md', summary);
    }

    // Cleanup Audio
    await fileManager.deleteFile(geminiAudio.name);
    fs.unlinkSync(localAudioPath);

    console.log("\n[EXECUTION COMPLETE] Proposal generated at Mountain_View_Estates_Proposal.md");

  } catch (err) {
    console.error("[CRITICAL FAILURE]", err);
  }
}

runInspector();
