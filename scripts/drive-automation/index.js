import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  });
  return google.drive({ version: 'v3', auth });
}

async function searchFolderByName(drive, namePattern, parentId = null) {
  let query = `mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  } else {
    query += ` and name contains '${namePattern}'`;
  }
  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
    corpora: 'allDrives',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true
  });
  
  if (parentId) {
    // Exact Javascript filtering for strict matching on single letters
    return response.data.files.filter(f => f.name.includes(namePattern));
  }
  return response.data.files;
}

async function createFolder(drive, parentId, folderName) {
  console.log(`Creating folder: ${folderName}`);
  const response = await drive.files.create({
    requestBody: { name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] },
    fields: 'id',
    supportsAllDrives: true
  });
  return response.data.id;
}

async function ensureFolder(drive, parentId, folderName) {
  // Use exact match for structural assurance
  const query = `name = '${folderName}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const response = await drive.files.list({
    q: query, fields: 'files(id, name)', spaces: 'drive', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true
  });
  
  if (response.data.files.length > 0) {
    console.log(`[✓] Folder ${folderName} already exists -> ID: ${response.data.files[0].id}`);
    return response.data.files[0].id;
  } else {
    const newId = await createFolder(drive, parentId, folderName);
    console.log(`[+] Created ${folderName} -> ID: ${newId}`);
    return newId;
  }
}

async function copyTemplate(drive, templateId, targetFolderId, newFileName) {
  console.log(`Copying template as: ${newFileName}...`);
  const response = await drive.files.copy({
    fileId: templateId,
    requestBody: { name: newFileName, parents: [targetFolderId] },
    supportsAllDrives: true
  });
  console.log(`[+] successfully created sheet: ${response.data.name} -> ID: ${response.data.id}`);
  return response.data.id;
}

async function runAutomation() {
  try {
    const drive = await authenticate();
    const PROPERTY_NAME = process.env.TARGET_PROPERTY_NAME;
    const BUILDING_NAME = process.env.TARGET_BUILDING_NAME; 
    const TEMPLATE_SHEET_ID = process.env.TEMPLATE_SHEET_ID;

    if (!PROPERTY_NAME || !BUILDING_NAME || !TEMPLATE_SHEET_ID) {
      throw new Error("Missing required .env variables: TARGET_PROPERTY_NAME, TARGET_BUILDING_NAME, or TEMPLATE_SHEET_ID.");
    }

    console.log(`[1] Scanning Drive for Property: ${PROPERTY_NAME}...`);
    const properties = await searchFolderByName(drive, PROPERTY_NAME);
    if (properties.length === 0) throw new Error(`Could not find Property Folder containing: ${PROPERTY_NAME}`);
    const propertyId = properties[0].id;
    
    console.log(`[2] Scanning inside ${properties[0].name} for Building: ${BUILDING_NAME}...`);
    const buildings = await searchFolderByName(drive, BUILDING_NAME, propertyId);
    if (buildings.length === 0) throw new Error(`Could not find Building Folder containing: ${BUILDING_NAME}`);
    const targetBuildingId = buildings[0].id;

    console.log(`\nInitializing Architecture for: ${buildings[0].name}`);
    const bidsFolderId = await ensureFolder(drive, targetBuildingId, "Bids");
    await copyTemplate(drive, TEMPLATE_SHEET_ID, bidsFolderId, `BLD - ${buildings[0].name}`);

    console.log("\n[EXECUTION COMPLETE] System Online.");
  } catch (error) {
    console.error("\n[ERROR] Execution Failed:", error.message);
  }
}

runAutomation();
