import { projectId } from '../../utils/supabase/info';

type SiteImageOverride = {
  public_url?: string | null;
  local_path?: string | null;
  focal_x?: number | null;
  focal_y?: number | null;
};

let overrides: Record<string, SiteImageOverride> = {};
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

    const resolvedPublicUrl = new URL(publicUrl, document.baseURI).href;
    if (img.src !== resolvedPublicUrl) {
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
