import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add timestamp to index.html to force cache invalidation
console.log('Adding timestamp to index.html...');
const indexPath = path.join(__dirname, 'dist', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
const timestamp = new Date().toISOString();
indexContent = indexContent.replace('</head>', `<meta name="deploy-timestamp" content="${timestamp}" /></head>`);
fs.writeFileSync(indexPath, indexContent);

// Deploy to GitHub Pages with a clean history
console.log('Deploying to GitHub Pages...');
execSync('npx gh-pages -d dist --no-history', { stdio: 'inherit' });

console.log('Deployment complete!'); 