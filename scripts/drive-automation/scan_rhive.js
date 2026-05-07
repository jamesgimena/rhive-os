import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

async function scanRhiveDrive() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  const drive = google.drive({ version: 'v3', auth });
   
  const drivesRes = await drive.drives.list();
  const rhiveDrive = drivesRes.data.drives.find(d => d.name.toUpperCase().includes('RHIVE'));
   
  if (!rhiveDrive) {
    console.log('RHIVE Drive not found. Available drives:', drivesRes.data.drives.map(d=>d.name));
    return;
  }
   
  console.log('Scanning RHIVE Drive:', rhiveDrive.id);
   
  const query = `'${rhiveDrive.id}' in parents and trashed = false`;
  const res = await drive.files.list({
    q: query,
    corpora: 'drive',
    driveId: rhiveDrive.id,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    fields: 'files(id, name, mimeType, createdTime)'
  });
   
  console.log('\nTop Level Folders/Documents:');
  res.data.files.forEach(f => console.log(`- ${f.name} [Created: ${f.createdTime}] (${f.mimeType})`));
}
scanRhiveDrive().catch(console.error);
