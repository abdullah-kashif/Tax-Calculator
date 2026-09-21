import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

console.log('Building Tax Calculator static deployment...');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy root static files
const rootFiles = ['index.html', 'style.css', 'app.js', 'favicon.svg'];
for (const file of rootFiles) {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} -> dist/${file}`);
  } else {
    console.warn(`! Missing file: ${file}`);
  }
}

// 2. Copy js directory (including js/vendor/)
const jsSrc = path.join(__dirname, 'js');
const jsDest = path.join(distDir, 'js');
if (fs.existsSync(jsSrc)) {
  fs.cpSync(jsSrc, jsDest, { recursive: true });
  console.log(`✓ Copied js/ -> dist/js/`);
}

// 3. Copy public directory assets
const publicSrc = path.join(__dirname, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, distDir, { recursive: true });
  console.log(`✓ Copied public/ contents -> dist/`);
}

console.log('✓ Build complete! dist/ is ready for Netlify deployment.');
