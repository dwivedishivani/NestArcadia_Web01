import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('public/fonts');
await mkdir(outDir, { recursive: true });

const cssUrl = new URL('https://fonts.googleapis.com/css2');
cssUrl.searchParams.append('family', 'Manrope:opsz,wght@9..40,300..600');
cssUrl.searchParams.append('family', 'Cormorant Garamond:ital,wght@0,400..700;1,400..700');
cssUrl.searchParams.set('display', 'swap');

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const cssResponse = await fetch(cssUrl, { headers: { 'User-Agent': userAgent } });
if (!cssResponse.ok) {
  throw new Error('Google Fonts CSS request failed: HTTP ' + cssResponse.status);
}
const remoteCss = await cssResponse.text();

// Only embed the Latin subset used by the site's English-language interface.
// Google Fonts can change its subset comment formatting; identify Latin faces by
// the actual Unicode range instead of relying on a comment immediately before
// each @font-face block.
const fontFaceBlocks = [...remoteCss.matchAll(/@font-face\s*\{[^}]+\}/g)]
  .map((match) => match[0]);
const latinBlocks = fontFaceBlocks.filter((block) =>
  /unicode-range\s*:[^;]*U\+0000-00FF/i.test(block)
);
if (latinBlocks.length === 0) {
  throw new Error('Google Fonts CSS contained no Latin Unicode-range font faces. Response preview: ' + remoteCss.slice(0, 1200));
}

function property(block, name) {
  const match = block.match(new RegExp('(?:^|\\n)\\s*' + name + '\\s*:\\s*([^;]+);', 'i'));
  return match ? match[1].trim() : '';
}

const faces = [];
const downloaded = new Map();

for (const block of latinBlocks) {
  const family = property(block, 'font-family').replace(/^['"]|['"]$/g, '');
  const style = property(block, 'font-style') || 'normal';
  const weight = property(block, 'font-weight');
  const unicodeRange = property(block, 'unicode-range');
  const source = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/i)?.[1];

  if (!source || !weight || !unicodeRange) continue;
  if (family !== 'Manrope' && family !== 'Cormorant Garamond') continue;

  const parsed = new URL(source);
  if (parsed.hostname !== 'fonts.gstatic.com') {
    throw new Error('Refusing an unexpected font host: ' + parsed.hostname);
  }

  let filename;
  if (family === 'Manrope' && style === 'normal') {
    filename = 'manrope-latin-v1.woff2';
  } else if (family === 'Cormorant Garamond' && style === 'normal') {
    filename = 'cormorant-garamond-latin-v1.woff2';
  } else if (family === 'Cormorant Garamond' && style === 'italic') {
    filename = 'cormorant-garamond-italic-latin-v1.woff2';
  } else {
    continue;
  }

  if (!downloaded.has(filename)) {
    const fontResponse = await fetch(source);
    if (!fontResponse.ok) {
      throw new Error('Font download failed for ' + filename + ': HTTP ' + fontResponse.status);
    }
    await writeFile(path.join(outDir, filename), Buffer.from(await fontResponse.arrayBuffer()));
    downloaded.set(filename, source);
  }

  faces.push([
    '@font-face {',
    "  font-family: '" + family + "';",
    '  font-style: ' + style + ';',
    '  font-weight: ' + weight + ';',
    '  font-display: swap;',
    "  src: url('/fonts/" + filename + "') format('woff2');",
    '  unicode-range: ' + unicodeRange + ';',
    '}',
  ].join('\n'));
}

const expected = [
  'manrope-latin-v1.woff2',
  'cormorant-garamond-latin-v1.woff2',
  'cormorant-garamond-italic-latin-v1.woff2',
];
for (const filename of expected) {
  if (!downloaded.has(filename)) {
    throw new Error(
      'Expected font ' + filename + ' was not found in the Latin subset. ' +
      'The Google Fonts response shape may have changed; refusing to generate a partial font stylesheet.'
    );
  }
}

const fontCss = faces.join('\n\n') + '\n';
if ((fontCss.match(/@font-face/g) || []).length < 3 ||
    fontCss.includes('fonts.googleapis.com') ||
    fontCss.includes('fonts.gstatic.com')) {
  throw new Error('Generated local font CSS failed validation.');
}
await writeFile(path.join(outDir, 'fonts-v1.css'), fontCss, 'utf8');

// Include the Open Font License notices with the local font files.
for (const [family, slug] of [
  ['Manrope', 'manrope'],
  ['Cormorant Garamond', 'cormorantgaramond'],
]) {
  try {
    const license = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/' + slug + '/OFL.txt');
    if (license.ok) {
      await writeFile(path.join(outDir, 'OFL-' + slug + '.txt'), await license.text(), 'utf8');
    } else {
      console.warn('License fetch for ' + family + ' returned HTTP ' + license.status + '; font build will continue.');
    }
  } catch {
    console.warn('Could not fetch the ' + family + ' OFL license during this build.');
  }
}

const sizes = [];
for (const filename of expected) {
  const info = await stat(path.join(outDir, filename));
  sizes.push(filename + ': ' + Math.round(info.size / 1024) + ' KB');
}
console.log('Self-hosted Latin fonts generated:');
console.log(sizes.join('\n'));
console.log('Generated font faces: ' + (fontCss.match(/@font-face/g) || []).length);
