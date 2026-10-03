type SiteImageOverride = { public_url?: string | null; local_path?: string | null };

let overrides: Record<string, SiteImageOverride> = {};

export function setSiteImageOverrides(items: Array<{ source_key: string; public_url?: string | null; local_path?: string | null }>) {
  overrides = Object.fromEntries(items.map((item) => [item.source_key, item]));
}

export function resolveSiteImage(sourceKey: string) {
  const item = overrides[sourceKey];
  return item?.public_url || item?.local_path || `/images/site/${sourceKey}.jpg`;
}

export function resolveSiteImageReference(value: string) {
  const match = value.match(/(?:site-image:\/\/|images\.unsplash\.com\/)(photo-\d+-[a-z0-9]+)/i);
  return match ? resolveSiteImage(match[1]) : value;
}
