import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });
drive.files.list({
  q: "name contains 'BLD B' and '198SZc3etLAI1k2VrNKjpn-Yp3-bRke-_' in parents",
  fields: 'files(id, name)',
  corpora: 'allDrives',
  includeItemsFromAllDrives: true,
  supportsAllDrives: true
}).then(res => console.log(JSON.stringify(res.data.files, null, 2)));
