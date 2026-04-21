const https = require('https');

// === INSTRUCTIONS =======================================================
// 1. In Google Chat, go to the Space via "Apps & integrations" -> "Manage webhooks"
// 2. Create Webhook and paste the URL below.
// ========================================================================
const WEBHOOK_URL = process.env.CHAT_WEBHOOK_URL || 'https://chat.googleapis.com/v1/spaces/AAQAM7z6EAk/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=XHQwOr4tkb1ITC24gq06FeVaGqjZLXK-_QlyP0-OpHg';

function sendChatMessage(text) {
  const payload = JSON.stringify({ text });
  
  const url = new URL(WEBHOOK_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };

  const req = https.request(options, (res) => {
    res.on('data', () => {});
    res.on('end', () => console.log('✅ 1m/1m Execution: Playload deployed to Google Chat Webhook.'));
  });

  req.on('error', (e) => console.error(`Error: ${e.message}`));
  req.write(payload);
  req.end();
}

// Example Execution of the Dan Martell Trailer Drop
const initialDrop = `*RHIVE Trailer Design Architecture (V1)*
I have scraped the Drive specs for the 2024 Wells Cargo RFV612S2 (charcoal base). Here are three conceptual passes:
1. Concept A: Aggressive Cyan geometric angles (Focus: High Visibility)
2. Concept B: Minimalist blacked-out with reflective logos (Focus: Luxury)
3. Concept C: QR-code heavy lead generation style (Focus: Utility)

**Recommendation:** Concept A aligns closest with the Tech-Noir aesthetic.
@Michael @Van @Sheena @Kara - Reply APPROVED with your concept choice so I can export the vector scale for Tyler.
-AI Assist`;

sendChatMessage(initialDrop);
