type SiteImageOverride = { public_url?: string | null; local_path?: string | null };

let overrides: Record<string, SiteImageOverride> = {};

export function setSiteImageOverrides(items: Array<{ source_key: string; public_url?: string | null; local_path?: string | null }>) {
  overrides = Object.fromEntries(items.map((item) => [item.source_key, item]));
}

export function resolveSiteImage(sourceKey: string) {
  const item = overrides[sourceKey];
  return item?.public_url || item?.local_path || `/images/site/${sourceKey}.jpg`;
}
