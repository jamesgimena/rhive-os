import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function inspectFolder() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  });
  const drive = google.drive({ version: 'v3', auth });
  const folderId = '1qdBz2R0RNdK8qhnmTwWHjMT5FdvzmpsW';

  try {
    const folder = await drive.files.get({ fileId: folderId, fields: 'name', supportsAllDrives: true });
    console.log('Folder Name:', folder.data.name);

    const q = `'${folderId}' in parents and trashed = false`;
    const res = await drive.files.list({
      q,
      fields: 'files(id, name, mimeType)',
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true
    });

    console.log('Contents:');
    res.data.files.forEach(f => console.log(f.name, f.id, f.mimeType));
  } catch (err) {
    console.error(err);
  }
}

inspectFolder();
