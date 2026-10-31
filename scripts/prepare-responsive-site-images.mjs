import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const manifestPath = path.join(projectRoot, 'src/data/responsive-site-images.json');
const outputDir = path.join(projectRoot, 'public/images/responsive');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error('Responsive image manifest is empty or invalid.');
}

try {
  execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
} catch {
  throw new Error('cwebp is required. Install the webp package before preparing site images.');
}

await mkdir(outputDir, { recursive: true });
const tempDir = await mkdtemp(path.join(tmpdir(), 'nestarcadia-images-'));
let totalBytes = 0;

try {
  for (const item of manifest) {
    if (!/^photo-\d+-[a-z0-9]+$/i.test(item.key) || !Array.isArray(item.widths) || !item.widths.length) {
      throw new Error('Invalid responsive image manifest entry: ' + JSON.stringify(item));
    }
    const sourceUrl = new URL(item.url);
    if (
      sourceUrl.origin !== 'https://etmrhxapfvyaispuvnft.supabase.co'
      || !sourceUrl.pathname.startsWith('/storage/v1/object/public/site-images/')
    ) {
      throw new Error('Image source must be a public NestArcadia site-images asset: ' + item.url);
    }
    const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) {
      throw new Error(`Image download failed for ${item.key}: HTTP ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      throw new Error(`Unexpected content type for ${item.key}: ${contentType}`);
    }

    const sourcePath = path.join(tempDir, item.key + '.source');
    await writeFile(sourcePath, new Uint8Array(await response.arrayBuffer()));

    for (const width of item.widths) {
      if (!Number.isInteger(width) || width < 320 || width > 2500) {
        throw new Error(`Invalid image width for ${item.key}: ${width}`);
      }
      const outputPath = path.join(outputDir, `${item.key}-${width}.webp`);
      execFileSync('cwebp', [
        '-quiet', '-mt', '-resize', String(width), '0', '-q', '74',
        sourcePath, '-o', outputPath,
      ], { stdio: 'inherit' });
      const outputStat = await stat(outputPath);
      if (outputStat.size <= 0) throw new Error('Generated image is empty: ' + outputPath);
      totalBytes += outputStat.size;
    }
    console.log(`Prepared ${item.key}: ${item.widths.join(', ')}px variants`);
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

console.log(`Prepared ${manifest.length} source images; generated ${manifest.reduce((sum, item) => sum + item.widths.length, 0)} WebP variants (${(totalBytes / 1024 / 1024).toFixed(2)} MiB).`);
