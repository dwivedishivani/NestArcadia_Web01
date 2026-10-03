import { projectId } from '../../utils/supabase/info';

type SiteImageOverride = {
  public_url?: string | null;
  local_path?: string | null;
  focal_x?: number | null;
  focal_y?: number | null;
};

let overrides: Record<string, SiteImageOverride> = {};
let focalObserverStarted = false;

function applyFocalPoints() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    const src = img.currentSrc || img.src;
    const match = src.match(/\/site-media\/image\/([^?]+)/);
    const sourceKey = match ? decodeURIComponent(match[1]) : Object.keys(overrides).find((key) => {
      const url = overrides[key]?.public_url;
      return Boolean(url && src.startsWith(url));
    });
    if (!sourceKey) return;
    const item = overrides[sourceKey];
    if (!item) return;
    const x = Number.isFinite(Number(item.focal_x)) ? Number(item.focal_x) : 50;
    const y = Number.isFinite(Number(item.focal_y)) ? Number(item.focal_y) : 50;
    img.style.objectPosition = `${x}% ${y}%`;
  });
}

function ensureFocalObserver() {
  if (focalObserverStarted || typeof document === 'undefined') return;
  focalObserverStarted = true;
  const observer = new MutationObserver(() => applyFocalPoints());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', applyFocalPoints);
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
  ensureFocalObserver();
  requestAnimationFrame(() => applyFocalPoints());
}

export function resolveSiteImage(sourceKey: string, _requestedWidth?: number) {
  const key = sourceKey.trim();
  if (!key) return '';
  const item = overrides[key];
  const storedUrl = item?.public_url || item?.local_path;
  if (storedUrl && !storedUrl.startsWith('/images/')) return storedUrl;
  return `https://${projectId}.supabase.co/functions/v1/site-media/image/${encodeURIComponent(key)}`;
}

export function resolveSiteImageReference(value: string) {
  const match = value.match(/site-image:\/\/(photo-\d+-[a-z0-9]+)/i);
  return match ? resolveSiteImage(match[1]) : value;
}
