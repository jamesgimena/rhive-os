const fs = require('fs');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
// https://www.googleapis.com/auth/gmail.modify allows us to read AND mark as read/archive.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), 'config', 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'config', 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  
  // Ensure config directory exists
  const configDir = path.join(process.cwd(), 'config');
  if (!fs.existsSync(configDir)){
      fs.mkdirSync(configDir);
  }
  
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  
  if (!fs.existsSync(CREDENTIALS_PATH)) {
     console.error("\n[!] MISSING credentials.json.");
     console.error("Please go to https://console.cloud.google.com/apis/credentials");
     console.error("1. Select your project (gen-lang-client...)");
     console.error("2. Create Credentials -> OAuth client ID -> Desktop App");
     console.error("3. Download JSON and place it at C:\\Users\\mjrob\\.gemini\\antigravity\\playground\\MJR_EPA\\config\\credentials.json\n");
     process.exit(1);
  }

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account to verify connection.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function verifyConnection(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found. But authentication was successful!');
    return;
  }
  console.log('✅ Success! Authenticated via native API. You are ready for AI Inbox Zero.');
}

console.log("Antigravity OS: Google Workspace Native Linker");
console.log("Initializing OAuth Flow...");

authorize().then(verifyConnection).catch(console.error);
