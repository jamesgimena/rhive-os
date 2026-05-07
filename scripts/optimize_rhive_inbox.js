const { google } = require('googleapis');

async function cleanAndDeployFilters(authPath) {
    const auth = google.auth.fromJSON(require(authPath));
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        console.log("🚀 PHASE 1: Wiping Legacy Filters");
        const filtersRes = await gmail.users.settings.filters.list({ userId: 'me' });
        const filters = filtersRes.data.filter || [];
        for (const f of filters) {
            await gmail.users.settings.filters.delete({ userId: 'me', id: f.id });
        }
        console.log(`✅ Deleted ${filters.length} legacy filters.`);

        console.log("\n🚀 PHASE 2: Wiping Redundant User Labels");
        const labelsRes = await gmail.users.labels.list({ userId: 'me' });
        const labels = labelsRes.data.labels || [];
        const userLabels = labels.filter(l => l.type === 'user');
        for (const l of userLabels) {
            try {
                await gmail.users.labels.delete({ userId: 'me', id: l.id });
            } catch (e) {
                // Ignore errors. Some user labels might be locked or have dependencies.
            }
        }
        console.log(`✅ Deleted custom sidebar folders/labels.`);

        console.log("\n🚀 PHASE 3: Deploying Dan Martell Macro-Labels");
        const newLabels = [
            { name: "1. Triage (Action Required)", labelListVisibility: "labelShow", messageListVisibility: "show" },
            { name: "2. Newsletters & Promos", labelListVisibility: "labelShow", messageListVisibility: "show" },
            { name: "3. Logs & Receipts", labelListVisibility: "labelShow", messageListVisibility: "show" },
            { name: "4. FYI / CC", labelListVisibility: "labelShow", messageListVisibility: "show" }
        ];
        
        const createdLabels = {};
        for (const lData of newLabels) {
            const res = await gmail.users.labels.create({ userId: 'me', requestBody: lData });
            createdLabels[lData.name] = res.data.id;
        }

        console.log("\n🚀 PHASE 4: Injecting Semantic Macro-Filters");
        
        // Filter 1: Newsletters
        await gmail.users.settings.filters.create({
            userId: 'me',
            requestBody: {
                criteria: { query: 'unsubscribe OR from:*@mail.beehiiv.com OR from:*@zohoone.com OR from:*@zohomeeting.com OR category:promotions' },
                action: { addLabelIds: [createdLabels["2. Newsletters & Promos"]], removeLabelIds: ['INBOX'] }
            }
        });

        // Filter 2: Silent Logs
        await gmail.users.settings.filters.create({
            userId: 'me',
            requestBody: {
                criteria: { query: 'subject:(Receipt OR Invoice OR Payment) OR from:no-reply@ OR from:noreply@' },
                action: { addLabelIds: [createdLabels["3. Logs & Receipts"]], removeLabelIds: ['INBOX'] }
            }
        });

        // Filter 3: The CC Failsafe (FYI Mute) - Archives emails where user is only CC'd
        await gmail.users.settings.filters.create({
            userId: 'me',
            requestBody: {
                criteria: { query: 'cc:michael@rhiveconstruction.com -to:michael@rhiveconstruction.com' },
                action: { addLabelIds: [createdLabels["4. FYI / CC"]], removeLabelIds: ['INBOX'] }
            }
        });

        // Filter 4: The Red Alert (Bids & Clients) -> Explicitly KEEP IN INBOX and flag
        await gmail.users.settings.filters.create({
            userId: 'me',
            requestBody: {
                criteria: { query: 'Bid OR RFP OR Estimate OR from:*@srsicorp.com OR from:*@gaf.com' },
                action: { addLabelIds: ['IMPORTANT', 'STARRED', createdLabels["1. Triage (Action Required)"]] }
            }
        });
        
        console.log(`✅ Successfully deployed 4 Macro-Filters (Dan Martell Architecture).`);

    } catch (e) {
        console.error(`ERROR:`, e.message);
    }
}

cleanAndDeployFilters('../config/rhive_token.json');
