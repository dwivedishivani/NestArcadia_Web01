import { projectId } from '../../utils/supabase/info';

type SiteImageOverride = {
  public_url?: string | null;
  local_path?: string | null;
  focal_x?: number | null;
  focal_y?: number | null;
};

const SITE_IMAGE_CACHE_KEY = 'nestarcadia-site-image-registry:v1';
const SITE_IMAGE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SiteImageRegistryItem = {
  source_key: string;
  public_url?: string | null;
  local_path?: string | null;
  focal_x?: number | null;
  focal_y?: number | null;
};

function isTrustedPublicImageUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.origin === `https://${projectId}.supabase.co`
      && url.pathname.startsWith('/storage/v1/object/public/site-images/');
  } catch {
    return false;
  }
}

function readCachedOverrides(): Record<string, SiteImageOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SITE_IMAGE_CACHE_KEY);
    if (!raw) return {};
    const cached = JSON.parse(raw) as { savedAt?: unknown; items?: unknown };
    if (typeof cached.savedAt !== 'number'
      || Date.now() - cached.savedAt > SITE_IMAGE_CACHE_TTL_MS
      || !Array.isArray(cached.items)) {
      return {};
    }

    const entries = cached.items.flatMap((entry: unknown): Array<[string, SiteImageOverride]> => {
      if (!entry || typeof entry !== 'object') return [];
      const item = entry as SiteImageRegistryItem;
      if (typeof item.source_key !== 'string' || !item.source_key) return [];
      const localPath = typeof item.local_path === 'string' && item.local_path.startsWith('/images/')
        ? item.local_path
        : null;
      const publicUrl = isTrustedPublicImageUrl(item.public_url) ? item.public_url : null;
      return [[item.source_key, {
        public_url: publicUrl,
        local_path: localPath,
        focal_x: typeof item.focal_x === 'number' && Number.isFinite(item.focal_x) ? item.focal_x : 50,
        focal_y: typeof item.focal_y === 'number' && Number.isFinite(item.focal_y) ? item.focal_y : 50,
      }]];
    });
    return Object.fromEntries(entries);
  } catch {
    // Storage can be disabled or full; the site still works without this cache.
    return {};
  }
}

function writeCachedOverrides(items: SiteImageRegistryItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SITE_IMAGE_CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      items: items.map((item) => ({
        source_key: item.source_key,
        public_url: isTrustedPublicImageUrl(item.public_url) ? item.public_url : null,
        local_path: typeof item.local_path === 'string' && item.local_path.startsWith('/images/')
          ? item.local_path
          : null,
        focal_x: item.focal_x,
        focal_y: item.focal_y,
      })),
    }));
  } catch {
    // Do not interrupt rendering if storage is unavailable or its quota is full.
  }
}

let overrides: Record<string, SiteImageOverride> = readCachedOverrides();
let focalObserverStarted = false;

function replaceImageSources() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    const src = img.currentSrc || img.src;
    const match = src.match(/\/site-media\/image\/([^?]+)/);
    const sourceKey = img.dataset.siteImageKey || (match ? decodeURIComponent(match[1]) : null);
    if (!sourceKey) return;
    const item = overrides[sourceKey];
    const publicUrl = item?.public_url;
    if (!publicUrl || publicUrl.startsWith('/images/')) return;

    const optimizedSourceUrl = img.dataset.siteImageOptimizedSourceUrl;
    if (optimizedSourceUrl && publicUrl === optimizedSourceUrl) return;

    const resolvedPublicUrl = new URL(publicUrl, document.baseURI).href;
    if (img.src !== resolvedPublicUrl) {
      // Drop the local responsive source if the Media Library's stored image changed.
      img.closest('picture')?.querySelectorAll<HTMLSourceElement>('source[data-site-image-optimized="true"]')
        .forEach((source) => source.remove());
      // The site-media image endpoint redirects to the original stored object;
      // use the direct URL after an override arrives to avoid a proxy redirect.
      img.removeAttribute('srcset');
      img.src = resolvedPublicUrl;
    }
  });
}
function applyFocalPoint(img: HTMLImageElement) {
  const src = img.currentSrc || img.src;
  const match = src.match(/\/site-media\/image\/([^?]+)/);
  const sourceKey = img.dataset.siteImageKey || (match ? decodeURIComponent(match[1]) : Object.keys(overrides).find((key) => {
    const url = overrides[key]?.public_url;
    return Boolean(url && src.startsWith(url));
  }));
  if (!sourceKey) return;
  const item = overrides[sourceKey];
  if (!item) return;
  const x = Number.isFinite(Number(item.focal_x)) ? Number(item.focal_x) : 50;
  const y = Number.isFinite(Number(item.focal_y)) ? Number(item.focal_y) : 50;
  img.style.objectPosition = `${x}% ${y}%`;
}

function applyFocalPoints() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLImageElement>('img').forEach(applyFocalPoint);
}

function ensureFocalObserver() {
  if (focalObserverStarted || typeof document === 'undefined') return;
  focalObserverStarted = true;
  const pendingImages = new Set<HTMLImageElement>();
  let frameScheduled = false;

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node instanceof HTMLImageElement) pendingImages.add(node);
        node.querySelectorAll<HTMLImageElement>('img').forEach((img) => pendingImages.add(img));
      });
    }

    if (pendingImages.size === 0 || frameScheduled) return;
    frameScheduled = true;
    requestAnimationFrame(() => {
      pendingImages.forEach(applyFocalPoint);
      pendingImages.clear();
      frameScheduled = false;
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', applyFocalPoints, { once: true });
}

export function setSiteImageOverrides(
  items: Array<{
    source_key: string;
    public_url?: string | null;
    local_path?: string | null;
    focal_x?: number | null;
    focal_y?: number | null;
  }>
) {
  overrides = Object.fromEntries(items.map((item) => [item.source_key, item]));
  writeCachedOverrides(items);
  replaceImageSources();
  ensureFocalObserver();
  requestAnimationFrame(() => { replaceImageSources(); applyFocalPoints(); });
}

export function resolveSiteImage(sourceKey: string, requestedWidth?: number) {
  const key = sourceKey.trim();
  if (!key) return '';
  const item = overrides[key];
  const storedUrl = item?.public_url || item?.local_path;
  if (storedUrl && !storedUrl.startsWith('/images/')) return storedUrl;
  const width = requestedWidth ? `?width=${Math.min(Math.max(Math.round(requestedWidth), 320), 1920)}&quality=78` : '';
  return `https://${projectId}.supabase.co/functions/v1/site-media/image/${encodeURIComponent(key)}${width}`;
}

export function resolveSiteImageReference(value: string) {
  const match = value.match(/site-image:\/\/(photo-\d+-[a-z0-9]+)/i);
  return match ? resolveSiteImage(match[1]) : value;
}
