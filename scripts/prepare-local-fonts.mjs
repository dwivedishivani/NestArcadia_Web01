import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('public/fonts');
await mkdir(outDir, { recursive: true });

const cssUrl = new URL('https://fonts.googleapis.com/css2');
cssUrl.searchParams.set(
  'family',
  'DM Sans:opsz,wght@9..40,300..600'
);
cssUrl.searchParams.append(
  'family',
  'Playfair Display:ital,wght@0,400..700;1,400..700'
);
cssUrl.searchParams.set('display', 'swap');

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const cssResponse = await fetch(cssUrl, { headers: { 'User-Agent': userAgent } });
if (!cssResponse.ok) {
  throw new Error(`Google Fonts CSS request failed: HTTP ${cssResponse.status}`);
}
const remoteCss = await cssResponse.text();

// Google returns separate subset blocks. Keeping only the Latin subset avoids
// downloading font files for scripts that the English-language site does not use.
const latinBlocks = [...remoteCss.matchAll(/\/\*\s*([^*]+?)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)]
  .filter((match) => match[1].trim().toLowerCase() === 'latin')
  .map((match) => match[2]);

function property(block, name) {
  const match = block.match(new RegExp('(?:^|\\n)\\s*' + name + '\\s*:\\s*([^;]+);', 'i'));
  return match?.[1]?.trim() ?? '';
}

const faces = [];
const downloaded = new Set();

for (const block of latinBlocks) {
  const family = property(block, 'font-family').replace(/^['"]|['"]$/g, '');
  const style = property(block, 'font-style') || 'normal';
  const weight = property(block, 'font-weight');
  const unicodeRange = property(block, 'unicode-range');
  const source = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/i)?.[1];

  if (!source || !weight || !unicodeRange) continue;
  const parsed = new URL(source);
  if (parsed.hostname !== 'fonts.gstatic.com') {
    throw new Error('Refusing an unexpected font host: ' + parsed.hostname);
  }

  let filename;
  if (family === 'DM Sans' && style === 'normal') {
    filename = 'dm-sans-latin-v1.woff2';
  } else if (family === 'Playfair Display' && style === 'normal') {
    filename = 'playfair-display-latin-v1.woff2';
  } else if (family === 'Playfair Display' && style === 'italic') {
    filename = 'playfair-display-italic-latin-v1.woff2';
  } else {
    continue;
  }

  if (!downloaded.has(filename)) {
    const fontResponse = await fetch(source);
    if (!fontResponse.ok) {
      throw new Error(`Font download failed for ${filename}: HTTP ${fontResponse.status}`);
    }
    await writeFile(path.join(outDir, filename), Buffer.from(await fontResponse.arrayBuffer()));
    downloaded.add(filename);
  }

  const fontFace = [
    '@font-face {',
    `  font-family: '${family}';`,
    `  font-style: ${style};`,
    `  font-weight: ${weight};`,
    '  font-display: swap;',
    `  src: url('/fonts/${filename}') format('woff2');`,
    `  unicode-range: ${unicodeRange};`,
    '}',
  ].join('\\n');
  faces.push(fontFace);
}

const expected = [
  'dm-sans-latin-v1.woff2',
  'playfair-display-latin-v1.woff2',
  'playfair-display-italic-latin-v1.woff2',
];
for (const filename of expected) {
  if (!downloaded.has(filename)) {
    throw new Error(
      `Expected font ${filename} was not found in the Latin subset. ` +
      'Check the Google Fonts CSS response before deploying.'
    );
  }
}

await writeFile(
  path.join(outDir, 'fonts-v1.css'),
  faces.join('\\n\\n') + '\\n',
  'utf8'
);

// Preserve the font licences with the generated files.
for (const [family, slug] of [
  ['DM Sans', 'dmsans'],
  ['Playfair Display', 'playfairdisplay'],
]) {
  try {
    const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`);
    if (license.ok) {
      await writeFile(path.join(outDir, `OFL-${slug}.txt`), await license.text(), 'utf8');
    }
  } catch {
    // Font hosting remains valid if a public license copy is temporarily unavailable.
    console.warn(`Could not fetch the ${family} OFL license during this build.`);
  }
}

console.log(
  'Self-hosted fonts: ' +
    [...downloaded].map((file) => file + ' (' + (requireNotAvailable(file)) + ')').join(', ')
);

function requireNotAvailable(filename) {
  return filename;
}
