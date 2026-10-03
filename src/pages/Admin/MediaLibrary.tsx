import { useEffect, useMemo, useRef, useState } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface MediaAsset {
  id: string;
  source_key: string;
  internal_name: string;
  display_name: string;
  category: string;
  page: string;
  section: string | null;
  alt_text: string | null;
  seo_file_name: string;
  local_path: string;
  storage_path: string | null;
  public_url: string | null;
  mime_type: string | null;
  updated_at: string;
}

interface Props {
  adminPassword: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/site-media`;

export default function MediaLibrary({ adminPassword }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const headers = useMemo(() => ({
    apikey: publicAnonKey,
    Authorization: `Bearer ${publicAnonKey}`,
    'X-Admin-Password': adminPassword,
  }), [adminPassword]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/images`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load media library');
      setAssets(data.data || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const pages = useMemo(
    () => ['all', ...Array.from(new Set(assets.map((asset) => asset.page).filter(Boolean))).sort()],
    [assets],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesPage = pageFilter === 'all' || asset.page === pageFilter;
      const haystack = [asset.display_name, asset.internal_name, asset.category, asset.page, asset.section, asset.source_key, asset.seo_file_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesPage && (!q || haystack.includes(q));
    });
  }, [assets, pageFilter, query]);

  const replaceImage = async (asset: MediaAsset, file: File) => {
    setUploading(asset.id);
    setMessage('');
    try {
      const suggestionRes = await fetch(`${API_BASE}/admin/images/suggest`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: asset.page,
          section: asset.section || asset.category,
          category: asset.category,
          subject: asset.display_name,
        }),
      });
      const suggestionPayload = await suggestionRes.json();
      if (!suggestionRes.ok) throw new Error(suggestionPayload.error || 'Could not prepare image SEO metadata');

      const suggestion = suggestionPayload.data;
      const form = new FormData();
      form.append('file', file);
      form.append('source_key', asset.source_key);
      form.append('display_name', asset.display_name);
      form.append('page', asset.page);
      form.append('section', asset.section || '');
      form.append('category', asset.category);
      form.append('seo_file_name', suggestion.seo_file_name);
      form.append('alt_text', suggestion.alt_text);

      const uploadRes = await fetch(`${API_BASE}/admin/images/upload`, {
        method: 'POST',
        headers,
        body: form,
      });
      const uploadPayload = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadPayload.error || 'Image upload failed');

      setMessage(`Replaced “${asset.display_name}” and generated SEO metadata.`);
      await loadAssets();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E] mb-2">Media system</p>
          <h3 className="font-display text-3xl text-[#1A1714]">Website Images</h3>
          <p className="text-[14px] text-[#6B5E4E] mt-2 max-w-2xl">
            Replace an image here and every page using the same image key will use the new asset. You do not need to edit code.
          </p>
        </div>
        <button type="button" onClick={loadAssets} className="border border-[#D4CBBB] px-4 py-2 text-[13px] hover:border-[#2D8C7E]">
          Refresh library
        </button>
      </div>

      <div className="border border-[#D4CBBB] p-4 mb-6 grid md:grid-cols-[1.5fr_0.7fr] gap-3" style={{ background: '#EAE4DA' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search image, section, page or SEO name…"
          className="bg-[#FDFCFA] border border-[#D4CBBB] px-4 py-3 text-[14px] outline-none focus:border-[#2D8C7E]"
        />
        <select
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          className="bg-[#FDFCFA] border border-[#D4CBBB] px-4 py-3 text-[14px] outline-none focus:border-[#2D8C7E]"
        >
          {pages.map((page) => <option key={page} value={page}>{page === 'all' ? 'All pages' : page}</option>)}
        </select>
      </div>

      {message && (
        <div className="mb-6 border border-[#D4CBBB] bg-[#FDFCFA] px-4 py-3 text-[13px] text-[#1A1714]">
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-[#6B5E4E]">Loading image library…</div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((asset) => {
            const preview = asset.public_url || asset.local_path;
            const busy = uploading === asset.id;
            return (
              <article key={asset.id} className="border border-[#D4CBBB] overflow-hidden" style={{ background: '#EAE4DA' }}>
                <div className="aspect-[4/3] bg-[#D4CBBB] overflow-hidden">
                  <img src={preview} alt={asset.alt_text || asset.display_name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#2D8C7E]">{asset.page} · {asset.category}</p>
                      <h4 className="text-[15px] font-medium text-[#1A1714] mt-1">{asset.display_name}</h4>
                    </div>
                    <span className="text-[10px] text-[#6B5E4E] whitespace-nowrap">{asset.section || 'Site image'}</span>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px] text-[#6B5E4E]">
                    <p><span className="text-[#1A1714]">Internal:</span> {asset.internal_name}</p>
                    <p><span className="text-[#1A1714]">SEO file:</span> {asset.seo_file_name}</p>
                    <p><span className="text-[#1A1714]">Key:</span> {asset.source_key}</p>
                  </div>

                  <input
                    ref={(node) => { inputRefs.current[asset.id] = node; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.currentTarget.value = '';
                      if (file) void replaceImage(asset, file);
                    }}
                  />

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => inputRefs.current[asset.id]?.click()}
                    className="mt-5 w-full bg-[#1C3A5A] text-white px-4 py-3 text-[13px] hover:bg-[#2D8C7E] transition-colors disabled:opacity-50"
                  >
                    {busy ? 'Replacing + preparing SEO…' : 'Replace image'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-20 text-center border border-[#D4CBBB] text-[#6B5E4E]">
          No images match this filter.
        </div>
      )}
    </div>
  );
}
