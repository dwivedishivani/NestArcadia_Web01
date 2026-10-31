import { access, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logoPath = path.join(root, 'src/assets/images/branding/nestarcadia-logo-transparent.png');
const publicDir = path.join(root, 'public');
await access(logoPath);
await mkdir(publicDir, { recursive: true });

try {
  execFileSync('convert', ['-version'], { stdio: 'ignore' });
  execFileSync('identify', ['-version'], { stdio: 'ignore' });
} catch {
  throw new Error('ImageMagick (convert and identify) is required to prepare NestArcadia app icons.');
}

const dimensions = execFileSync('identify', ['-format', '%w %h', logoPath], { encoding: 'utf8' })
  .trim()
  .split(/\s+/)
  .map(Number);
const [sourceWidth, sourceHeight] = dimensions;
if (!Number.isInteger(sourceWidth) || !Number.isInteger(sourceHeight) || sourceWidth < 64 || sourceHeight < 64) {
  throw new Error('Unexpected NestArcadia logo dimensions: ' + dimensions.join('x'));
}

// The brand asset is a square lockup: the house mark occupies the upper 68%.
// Use the mark—not the tiny wordmark—for small app/favicon sizes, preserving
// the exact original brand artwork without redrawing or distorting it.
const markHeight = Math.round(sourceHeight * 0.68);
const crop = `${sourceWidth}x${markHeight}+0+0`;
const background = '#F2EDE4';
const icons = [
  { name: 'apple-touch-icon.png', size: 180, mark: 140 },
  { name: 'android-chrome-192x192.png', size: 192, mark: 148 },
  { name: 'android-chrome-512x512.png', size: 512, mark: 390 },
  { name: 'favicon-48x48.png', size: 48, mark: 38 },
  { name: 'favicon-32x32.png', size: 32, mark: 25 },
  { name: 'favicon-16x16.png', size: 16, mark: 13 },
];

for (const icon of icons) {
  const output = path.join(publicDir, icon.name);
  execFileSync('convert', [
    logoPath,
    '-crop', crop,
    '+repage',
    '-trim',
    '+repage',
    '-resize', `${icon.mark}x${icon.mark}`,
    '-gravity', 'center',
    '-background', background,
    '-extent', `${icon.size}x${icon.size}`,
    '-strip',
    output,
  ], { stdio: 'inherit' });
  const result = await stat(output);
  if (result.size === 0) throw new Error('Generated app icon is empty: ' + icon.name);
}

execFileSync('convert', [
  path.join(publicDir, 'favicon-16x16.png'),
  path.join(publicDir, 'favicon-32x32.png'),
  path.join(publicDir, 'favicon-48x48.png'),
  path.join(publicDir, 'favicon.ico'),
], { stdio: 'inherit' });

console.log('Prepared NestArcadia favicon, Apple touch icon, and Android/PWA icons.');
