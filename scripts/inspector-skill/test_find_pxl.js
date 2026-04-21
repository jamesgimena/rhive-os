import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const auth = new google.auth.GoogleAuth({
  keyFile: '../drive-automation/service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

async function test() {
  const q = `name contains 'pxl'`;
  const res = await drive.files.list({q, fields: 'files(id, name, mimeType, parents)', corpora: 'allDrives', includeItemsFromAllDrives: true, supportsAllDrives: true});
  console.log(JSON.stringify(res.data.files, null, 2));
}
test();
