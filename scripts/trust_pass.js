const { google } = require('googleapis');

async function getTopEmails(authPath, accountName) {
    const auth = google.auth.fromJSON(require(authPath));
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread',
            maxResults: 5
        });

        const messages = res.data.messages || [];
        console.log(`\n=== Top 5 Unread Emails for ${accountName} ===`);
        for (const msg of messages) {
            const msgData = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
                format: 'metadata',
                metadataHeaders: ['Subject', 'From']
            });
            const headers = msgData.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            console.log(`- From: ${from} | Subject: ${subject}`);
        }
    } catch (e) {
        console.error(`Error fetching emails for ${accountName}:`, e.message);
    }
}

async function getFilters(authPath) {
    const auth = google.auth.fromJSON(require(authPath));
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const [labelsRes, filtersRes] = await Promise.all([
            gmail.users.labels.list({ userId: 'me' }),
            gmail.users.settings.filters.list({ userId: 'me' })
        ]);

        const labelsMap = {};
        (labelsRes.data.labels || []).forEach(l => {
            labelsMap[l.id] = l.name;
        });

        console.log(`\n=== Existing Gmail Filters for RHIVE ===`);
        const filters = filtersRes.data.filter || [];
        if (filters.length === 0) {
            console.log("No custom filters found.");
        } else {
            filters.forEach((f, i) => {
                const criteria = f.criteria;
                const action = f.action;
                
                let criteriaStr = [];
                if (criteria.from) criteriaStr.push(`From: ${criteria.from}`);
                if (criteria.to) criteriaStr.push(`To: ${criteria.to}`);
                if (criteria.subject) criteriaStr.push(`Subject: ${criteria.subject}`);
                if (criteria.query) criteriaStr.push(`Query: ${criteria.query}`);

                let actionStr = [];
                if (action.addLabelIds) {
                    const labelNames = action.addLabelIds.map(id => labelsMap[id] || id);
                    actionStr.push(`Apply Label: [${labelNames.join(', ')}]`);
                }
                if (action.removeLabelIds && action.removeLabelIds.includes('INBOX')) {
                    actionStr.push('Archive (Skip Inbox)');
                }
                if (action.forward) {
                    actionStr.push(`Forward to: ${action.forward}`);
                }

                console.log(`Filter ${i + 1}: If { ${criteriaStr.join(' | ')} } => Then { ${actionStr.join(' | ')} }`);
            });
        }
    } catch (e) {
        console.error(`Error fetching filters:`, e.message);
    }
}

async function run() {
    await getTopEmails('../config/token.json', 'MJROB14');
    await getTopEmails('../config/rhive_token.json', 'RHIVE');
    await getFilters('../config/rhive_token.json');
}

run();
