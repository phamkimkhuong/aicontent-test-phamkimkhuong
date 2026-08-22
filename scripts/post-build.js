'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const standalone = path.join(root, '.next', 'standalone');
const staticSrc = path.join(root, '.next', 'static');
const staticDest = path.join(standalone, '.next', 'static');
const publicSrc = path.join(root, 'public');
const publicDest = path.join(standalone, 'public');

if (fs.existsSync(standalone)) {
  if (fs.existsSync(staticDest)) fs.rmSync(staticDest, { recursive: true, force: true });
  if (fs.existsSync(publicDest)) fs.rmSync(publicDest, { recursive: true, force: true });

  if (fs.existsSync(staticSrc)) {
    fs.mkdirSync(path.dirname(staticDest), { recursive: true });
    fs.cpSync(staticSrc, staticDest, { recursive: true });
  }

  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, publicDest, { recursive: true });
  }

  console.log('✅ Post-build: Static assets copied to .next/standalone successfully!');
}
