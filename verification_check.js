import http from 'http';

const BASE_URL = 'http://localhost:3003';

console.log(`Checking connectivity to ${BASE_URL}...`);

const checkServer = () => {
    const req = http.get(BASE_URL, (res) => {
        console.log(`Server Status Code: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log("✅ Server is reachable.");

            // Collect data to see if we get the React root
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (data.includes('<div id="root">') || data.includes('<div id="app">')) {
                    console.log("✅ React Root container found in HTML.");
                } else {
                    console.log("⚠️ HTML fetched but root container not obvious (might be different ID).");
                }
                process.exit(0);
            });
        } else {
            console.error(`❌ Server returned non-200 status: ${res.statusCode}`);
            process.exit(1);
        }
    });

    req.on('error', (e) => {
        console.error(`❌ Connection failed: ${e.message}`);
        console.error("Hints: Is the server running? Is the port correct?");
        process.exit(1);
    });
};

checkServer();
