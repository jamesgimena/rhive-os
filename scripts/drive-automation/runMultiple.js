import { spawn } from 'child_process';

const buildings = [
  "Bld - 7", "Bld - 8", "Bld - 9", "Bld - 10", 
  "Bld - 11", "Bld - 12", "Bld - 13", "Bld - 14", 
  "Bld - 15", "Bld - 16"
];

async function run() {
  for (const bld of buildings) {
    console.log(`\n\n--- Deploying Architecture for ${bld} ---`);
    await new Promise((resolve, reject) => {
      const proc = spawn('npm', ['start'], {
        env: {
          ...process.env,
          TARGET_PROPERTY_NAME: "Mountain View",
          TARGET_BUILDING_NAME: bld
        },
        stdio: 'inherit',
        shell: true
      });
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Failed with code ${code}`));
      });
    });
  }
}
run();
