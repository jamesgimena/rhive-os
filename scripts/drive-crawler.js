import { google } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const firestore = new Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'gen-lang-client-002611600' });
const ai = new GoogleGenAI({});

async function getDriveClient(authPath) {
    const auth = google.auth.fromJSON(require(authPath));
    return google.drive({ version: 'v3', auth });
}

/**
 * Sweeps the RHIVE Google Drive for updated documents, generates embeddings, and writes to Firestore.
 */
async function syncDriveToLedger() {
    console.log("[Omni-Crawler] Initiating Drive-to-Ledger sync...");
    try {
        const drive = await getDriveClient('../config/rhive_token.json');
        
        // Find recent PDFs, Docs or Sheets created in RHIVE drive
        const res = await drive.files.list({
            pageSize: 5,
            fields: 'nextPageToken, files(id, name, mimeType, createdTime, modifiedTime)',
            q: "mimeType='application/pdf' or mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet'",
            orderBy: 'modifiedTime desc'
        });

        const files = res.data.files || [];
        if (files.length === 0) {
            console.log("[Omni-Crawler] No documents found.");
            return;
        }

        for (const file of files) {
            console.log(`[Omni-Crawler] Analyzing ${file.name} (${file.mimeType})`);
            
            // In a full production scale, we would extract the raw text from the document here via Drive API export.
            // For the semantic map, we will embed the metadata and critical context footprint.
            const documentContext = `Document Name: ${file.name}. Type: ${file.mimeType}. Last Modified: ${file.modifiedTime}.`;

            const embeddingResponse = await ai.models.embedContent({
                model: 'text-embedding-004',
                contents: documentContext,
            });

            // Store in Firestore Vector DB
            const docRef = firestore.collection('synergy_ledger').doc(file.id);
            await docRef.set({
                type: 'drive_document',
                timestamp: file.modifiedTime,
                filename: file.name,
                vector: embeddingResponse.embeddings[0].values,
                raw_context: documentContext,
                drive_link: `https://drive.google.com/file/d/${file.id}/view`
            });

            console.log(`[Omni-Crawler] -> Mapped & Secured to Ledger: ${file.id}`);
        }
    } catch (e) {
         console.error("[Omni-Crawler] Error during Drive Sync:", e.message);
    }
}

syncDriveToLedger();
