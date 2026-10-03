import { projectId } from '../../utils/supabase/info';

type SiteImageOverride = { public_url?: string | null; local_path?: string | null };

let overrides: Record<string, SiteImageOverride> = {};

export function setSiteImageOverrides(items: Array<{ source_key: string; public_url?: string | null; local_path?: string | null }>) {
  overrides = Object.fromEntries(items.map((item) => [item.source_key, item]));
}

export function resolveSiteImage(sourceKey: string, requestedWidth?: number) {
  const key = sourceKey.trim();
  if (!key) return '';
  const item = overrides[key];
  const base = item?.public_url || item?.local_path || `https://${projectId}.supabase.co/functions/v1/site-media/image/${encodeURIComponent(key)}`;
  if (!base || base.startsWith('/images/')) return base;
  const width = Math.min(1920, Math.max(640, Math.round(requestedWidth || 1280)));
  return `${base}${base.includes('?') ? '&' : '?'}width=${width}&quality=78`;
}

export function resolveSiteImageReference(value: string) {
  const match = value.match(/site-image:\/\/(photo-\d+-[a-z0-9]+)/i);
  return match ? resolveSiteImage(match[1]) : value;
}
