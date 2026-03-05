import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TEMPLATE_REPO = 'https://raw.githubusercontent.com/csaldivar-astate/backend-starter/main';

async function downloadFile(remotePath: string, localPath: string): Promise<boolean> {
  const url = `${TEMPLATE_REPO}/${remotePath}`;
  const res = await fetch(url);

  if (!res.ok) return false;

  const content = await res.text();
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, content);
  return true;
}

async function sync(): Promise<void> {
  console.log('Fetching manifest...\n');

  const res = await fetch(`${TEMPLATE_REPO}/sync-manifest.json`);
  if (!res.ok) {
    console.error('Failed to fetch manifest. Check your internet connection.');
    process.exit(1);
  }

  const manifest: { files: string[]; delete?: string[] } = await res.json();
  console.log(`Syncing ${manifest.files.length} files...\n`);

  for (const file of manifest.files) {
    const dest = path.resolve(file);
    const success = await downloadFile(file, dest);
    console.log(success ? `  ✓ ${file}` : `  ✗ ${file} (not found in template)`);
  }

  if (manifest.delete) {
    console.log(`\nRemoving ${manifest.delete.length} deprecated files...\n`);

    for (const file of manifest.delete) {
      const dest = path.resolve(file);
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
        console.log(`  ✓ deleted ${file}`);
      } else {
        console.log(`  - ${file} (already gone)`);
      }
    }
  }

  console.log('\nInstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\nSync complete!');
}

await sync();
