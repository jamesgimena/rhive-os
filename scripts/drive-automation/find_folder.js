import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function searchFolderByName(drive, namePattern) {
  const query = `name contains '${namePattern}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name, parents)',
    spaces: 'drive',
    corpora: 'allDrives',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true
  });
  return response.data.files;
}

async function findTarget() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  });
  const drive = google.drive({ version: 'v3', auth });
  
  // Find Madison Square
  console.log("Searching for Madison Square properties...");
  const madison = await searchFolderByName(drive, "Madison Square");
  console.log(madison.map(f => `${f.name} (ID: ${f.id})`).join('\n'));
  
  if (madison.length > 0) {
    const parentId = madison[0].id;
    console.log(`\nSearching for Building C inside ${madison[0].name}...`);
    
    // Search for BLD C or Building C
    let query = `name contains 'C ' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    let response = await drive.files.list({
      q: query, fields: 'files(id, name)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true
    });
    
    let bldC = response.data.files;
    console.log(bldC.length > 0 ? `Found: ${bldC[0].name} (ID: ${bldC[0].id})` : "Not found in parent.");
  }
}
findTarget().catch(console.error);
