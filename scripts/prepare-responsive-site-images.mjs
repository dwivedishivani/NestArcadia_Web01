import { mkdtemp, mkdir, readFile, rename, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const sourceDir = path.join(projectRoot, 'src');
const manifestPath = path.join(sourceDir, 'data/responsive-site-images.json');
const outputDir = path.join(projectRoot, 'public/images/responsive');
const outputParent = path.dirname(outputDir);
const primaryHeroKey = 'photo-1713192706971-03900dcf5706';

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error('Responsive image manifest is empty or invalid.');
}

async function collectResponsiveImageKeys(dirPath) {
  const referenced = new Set();
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.next', 'build'].includes(entry.name)) continue;
      const nested = await collectResponsiveImageKeys(fullPath);
      nested.forEach((key) => referenced.add(key));
      continue;
    }

    if (!/\.(ts|tsx|js|jsx|mjs|json)$/i.test(entry.name)) continue;
    const content = await readFile(fullPath, 'utf8');

    // Only keys in modules that actually request responsive srcsets are in scope.
    // This deliberately excludes ordinary Unsplash/Edge Function images elsewhere.
    if (!content.includes('resolveSiteImageSrcSet(')) continue;

    for (const match of content.matchAll(/photo-\d+-[a-z0-9]+/gi)) {
      const key = match[0].toLowerCase();
      // The first homepage hero has its own separately generated responsive asset pair.
      if (key !== primaryHeroKey) referenced.add(key);
    }
  }

  return referenced;
}

const manifestKeys = new Set();
for (const item of manifest) {
  if (!item || !/^photo-\d+-[a-z0-9]+$/i.test(item.key || '')
    || typeof item.url !== 'string'
    || !Array.isArray(item.widths)
    || item.widths.length === 0
    || new Set(item.widths).size !== item.widths.length
    || item.widths.some((width, index) =>
      !Number.isInteger(width)
      || width < 320
      || width > 2500
      || (index > 0 && width <= item.widths[index - 1])
    )) {
    throw new Error('Invalid responsive image manifest entry: ' + JSON.stringify(item));
  }

  if (manifestKeys.has(item.key)) {
    throw new Error('Duplicate responsive image manifest key: ' + item.key);
  }
  manifestKeys.add(item.key);
}

const referencedKeys = await collectResponsiveImageKeys(sourceDir);
const missingKeys = [...referencedKeys].filter((key) => !manifestKeys.has(key)).sort();
const unusedKeys = [...manifestKeys].filter((key) => !referencedKeys.has(key)).sort();

if (missingKeys.length > 0) {
  throw new Error('Responsive image manifest missing approved entries for: ' + missingKeys.join(', '));
}
if (unusedKeys.length > 0) {
  throw new Error('Responsive image manifest contains unused entries: ' + unusedKeys.join(', '));
}

try {
  execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
} catch {
  throw new Error('cwebp is required. Install the webp package before preparing site images.');
}

await mkdir(outputParent, { recursive: true });
const tempDir = await mkdtemp(path.join(tmpdir(), 'nestarcadia-images-'));
const stagingDir = await mkdtemp(path.join(outputParent, '.responsive-staging-'));
const backupDir = stagingDir + '-previous';
let totalBytes = 0;
let previousOutputMoved = false;

try {
  for (const item of manifest) {
    const sourceUrl = new URL(item.url);
    if (
      sourceUrl.protocol !== 'https:'
      || sourceUrl.origin !== 'https://etmrhxapfvyaispuvnft.supabase.co'
      || !sourceUrl.pathname.startsWith('/storage/v1/object/public/site-images/')
      || sourceUrl.search
      || sourceUrl.hash
    ) {
      throw new Error('Image source must be a clean public NestArcadia site-images asset: ' + item.url);
    }

    const response = await fetch(sourceUrl.href, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) {
      throw new Error(`Image download failed for ${item.key}: HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      throw new Error(`Unexpected content type for ${item.key}: ${contentType}`);
    }

    const sourceBytes = new Uint8Array(await response.arrayBuffer());
    if (sourceBytes.length === 0) throw new Error('Downloaded image is empty: ' + item.key);
    const sourcePath = path.join(tempDir, `${item.key}.source`);
    await writeFile(sourcePath, sourceBytes);

    for (const width of item.widths) {
      const outputPath = path.join(stagingDir, `${item.key}-${width}.webp`);
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

  // Swap only after every source and variant has passed validation. A failed
  // download or conversion leaves the previous production-ready set untouched.
  try {
    await rename(outputDir, backupDir);
    previousOutputMoved = true;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  try {
    await rename(stagingDir, outputDir);
  } catch (error) {
    if (previousOutputMoved) {
      await rename(backupDir, outputDir);
      previousOutputMoved = false;
    }
    throw error;
  }

  if (previousOutputMoved) {
    await rm(backupDir, { recursive: true, force: true });
    previousOutputMoved = false;
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
  await rm(stagingDir, { recursive: true, force: true });
}

const variantCount = manifest.reduce((sum, item) => sum + item.widths.length, 0);
console.log(`Validated ${referencedKeys.size} responsive source keys; generated ${variantCount} WebP variants (${(totalBytes / 1024 / 1024).toFixed(2)} MiB). Stale variants were removed by replacing the generated directory.`);
