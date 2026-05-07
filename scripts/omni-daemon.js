import { google } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// NOTE: This requires GOOGLE_APPLICATION_CREDENTIALS to be set in the environment for Firestore/GenAI.
// Project ID known from context: gen-lang-client-002611600
const firestore = new Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'gen-lang-client-002611600' });
// Initialize genAI with the new SDK format. Assuming API key is in environment or gcloud auth.
const ai = new GoogleGenAI({});

async function getGmailClient(authPath) {
    const auth = google.auth.fromJSON(require(authPath));
    return google.gmail({ version: 'v1', auth });
}

/**
 * Sweeps the inbox for un-synced emails, generates a vector embedding, and pushes to Firestore.
 */
async function syncEmailsToLedger() {
    console.log("[Omni-Daemon] Initiating Synergy Ledger sync...");
    try {
        const gmail = await getGmailClient('../config/rhive_token.json');
        
        // Find emails that haven't been tagged as synced to the ledger yet
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            q: '-label:vector-synced' 
        });

        const messages = res.data.messages || [];
        if (messages.length === 0) {
            console.log("[Omni-Daemon] No new emails to vector-map. Sleeping.");
            return;
        }

        for (const msg of messages) {
            const msgData = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'metadata', metadataHeaders: ['Subject', 'From', 'Date'] });
            
            const headers = msgData.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
            
            const textContent = `Email from ${from} regarding ${subject} on ${date}.`;
            
            console.log(`[Omni-Daemon] Generating Embedding for: ${subject}`);
            
            // Generate semantic embedding using the official Google Gen AI text-embedding-004 model
            const embeddingResponse = await ai.models.embedContent({
                model: 'text-embedding-004',
                contents: textContent,
            });

            // Store in Firestore
            const docRef = firestore.collection('synergy_ledger').doc(msg.id);
            await docRef.set({
                type: 'email',
                timestamp: date,
                sender: from,
                subject: subject,
                vector: embeddingResponse.embeddings[0].values, // The float array
                raw_context: textContent
            });

            // (Optional in production: Tag the email in Gmail as `vector-synced` so we don't double process it)
            // await gmail.users.messages.modify({userId: 'me', id: msg.id, requestBody: {addLabelIds: ['LABEL_ID']}});
            
            console.log(`[Omni-Daemon] -> Mapped & Secured to Ledger: ${msg.id}`);
        }
    } catch (e) {
         console.error("[Omni-Daemon] Error during Ledger Sync:", e.message);
    }
}

// In production, this would be wrapped in a setInterval or Cron.
syncEmailsToLedger();
