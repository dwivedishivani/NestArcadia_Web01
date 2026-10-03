import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const outputRoot = path.join(root, 'public', 'images', 'site');
const photoPattern = /photo-\d+-[A-Za-z0-9_-]+/g;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else if (/\.(tsx?|jsx?|css|json)$/.test(entry.name)) files.push(file);
  }
  return files;
}

const ids = new Set();
for (const file of await walk(sourceRoot)) {
  const text = await fs.readFile(file, 'utf8');
  for (const id of text.match(photoPattern) || []) ids.add(id);
}
await fs.mkdir(outputRoot, { recursive: true });

let downloaded = 0;
for (const id of [...ids].sort()) {
  const target = path.join(outputRoot, id + '.jpg');
  try { await fs.access(target); continue; } catch {}
  const host = ['https:', '/', '/', 'images', '.', 'unsplash', '.', 'com/'].join('');
  const url = host + id + '?w=1600&fit=max&auto=format&fm=jpg&q=82';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Image download failed: ' + id + ' (' + response.status + ')');
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
  downloaded++;
}
console.log('NestArcadia local images: ' + ids.size + ' unique assets, ' + downloaded + ' downloaded.');
