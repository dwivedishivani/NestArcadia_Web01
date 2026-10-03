import { projectId } from '../../utils/supabase/info';

type SiteImageOverride = { public_url?: string | null; local_path?: string | null };

let overrides: Record<string, SiteImageOverride> = {};

export function setSiteImageOverrides(items: Array<{ source_key: string; public_url?: string | null; local_path?: string | null }>) {
  overrides = Object.fromEntries(items.map((item) => [item.source_key, item]));
}

export function resolveSiteImage(sourceKey: string, _requestedWidth?: number) {
  const key = sourceKey.trim();
  if (!key) return '';

  const item = overrides[key];
  const storedUrl = item?.public_url || item?.local_path;

  // Use the owned Supabase Storage asset directly once the media registry has loaded.
  // Do not append image-transformation query parameters here: the current public
  // storage endpoint serves the stored asset as-is. Responsive derivatives can
  // be introduced later at the storage/proxy layer without changing page code.
  if (storedUrl && !storedUrl.startsWith('/images/')) return storedUrl;

  // Before the registry response arrives, use the owned media proxy rather than
  // any third-party/source URL. This also keeps first render independent of DB timing.
  return `https://${projectId}.supabase.co/functions/v1/site-media/image/${encodeURIComponent(key)}`;
}

export function resolveSiteImageReference(value: string) {
  const match = value.match(/site-image:\/\/(photo-\d+-[a-z0-9]+)/i);
  return match ? resolveSiteImage(match[1]) : value;
}
