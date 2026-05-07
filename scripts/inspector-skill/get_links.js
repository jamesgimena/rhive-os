import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const driveAuth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth: driveAuth });

async function findVideoRecursively(folderId) {
  const res = await drive.files.list({ q: `'${folderId}' in parents and mimeType contains 'video/mp4' and trashed = false`, fields: 'files(id, name, webViewLink)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true });
  if (res.data.files && res.data.files.length > 0) return res.data.files[0];
  
  const sub = await drive.files.list({ q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false`, fields: 'files(id, name)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true });
  if (sub.data.files) {
    for (let f of sub.data.files) {
      let vid = await findVideoRecursively(f.id);
      if (vid) return vid;
    }
  }
  return null;
}

async function run() {
  const PROP_FOLDER_ID = process.env.PROPERTY_FOLDER_ID;
  const bldingsRes = await drive.files.list({
    q: `'${PROP_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name, webViewLink)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true
  });
  const buildings = bldingsRes.data.files.filter(f => f.name.toLowerCase().includes('bld'));
  
  let result = [];
  for (const bld of buildings) {
    const vid = await findVideoRecursively(bld.id);
    result.push({
      bldName: bld.name,
      bldLink: bld.webViewLink,
      vidLink: vid ? vid.webViewLink : null
    });
  }
  console.log(JSON.stringify(result, null, 2));
}
run();
