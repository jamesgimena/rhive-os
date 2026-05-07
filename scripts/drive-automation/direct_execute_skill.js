import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function executeBidInitDirectly() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });
    const drive = google.drive({ version: 'v3', auth });
    
    // The exact folder ID provided by the user
    const targetFolderId = '1qdBz2R0RNdK8qhnmTwWHjMT5FdvzmpsW';
    const TEMPLATE_SHEET_ID = process.env.TEMPLATE_SHEET_ID;

    console.log(`[1] Accessing provided property folder URL...`);
    const propertyInfo = await drive.files.get({ fileId: targetFolderId, fields: 'name', supportsAllDrives: true });
    console.log(`    Target Property Acquired: ${propertyInfo.data.name}`);

    // Create the 'Bids' folder directly in the property (since there are no sub-buildings present here)
    console.log(`\nInitializing Architecture for: ${propertyInfo.data.name}`);
    console.log(`Creating folder: Bids`);
    const folderRes = await drive.files.create({
      requestBody: { name: 'Bids', mimeType: 'application/vnd.google-apps.folder', parents: [targetFolderId] },
      fields: 'id',
      supportsAllDrives: true
    });
    const bidsFolderId = folderRes.data.id;
    console.log(`[+] Created Bids -> ID: ${bidsFolderId}`);

    // Drop the new quote template directly into Bids
    const fileName = `BLD - ${propertyInfo.data.name}`;
    console.log(`Copying template as: ${fileName}...`);
    const copyRes = await drive.files.copy({
      fileId: TEMPLATE_SHEET_ID,
      requestBody: { name: fileName, parents: [bidsFolderId] },
      supportsAllDrives: true
    });
    console.log(`[+] successfully created sheet: ${copyRes.data.name} -> ID: ${copyRes.data.id}`);
    
    console.log("\n[EXECUTION COMPLETE] System Online.");
  } catch (error) {
    console.error("\n[ERROR] Execution Failed:", error.message);
  }
}

executeBidInitDirectly();
