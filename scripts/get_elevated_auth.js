const { authenticate } = require('@google-cloud/local-auth');
const fs = require('fs');

async function run() {
  console.log("Starting Auth Server. Please look for a new browser window or tab...");
  try {
    const credsStr = fs.readFileSync('./config/credentials.json', 'utf8');
    const creds = JSON.parse(credsStr).installed || JSON.parse(credsStr).web;

    const client = await authenticate({
      scopes: [
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.settings.basic'
      ],
      keyfilePath: './config/credentials.json'
    });

    const rhive = {
      type: 'authorized_user',
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: client.credentials.refresh_token
    };

    fs.writeFileSync('./config/rhive_token.json', JSON.stringify(rhive, null, 2));
    console.log('\n✅ Successfully saved elevated rhive_token.json');
    process.exit(0);
  } catch (err) {
    console.error('Auth Failed:', err.message);
    process.exit(1);
  }
}

run();
