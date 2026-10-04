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
  focal_x: number | null;
  focal_y: number | null;
  optimized_at: string | null;
  original_bytes: number | null;
  optimized_bytes: number | null;
  optimized_width: number | null;
  optimized_height: number | null;
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
  const [cropAsset, setCropAsset] = useState<MediaAsset | null>(null);
  const [cropPreview, setCropPreview] = useState('');
  const [cropData, setCropData] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [cropDisplayScale, setCropDisplayScale] = useState(1);
  const [cropDragging, setCropDragging] = useState<'move' | 'resize' | null>(null);
  const [cropDragStart, setCropDragStart] = useState<{ x: number; y: number } | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);
  const [optimizingAll, setOptimizingAll] = useState(false);
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

  const prepareImageForUpload = async (file: File) => {
    const source = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = source;
      await img.decode();
      const maxDimension = 2400;
      const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
      if (!blob || blob.size >= file.size) return file;
      return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
    } finally {
      URL.revokeObjectURL(source);
    }
  };

  const replaceImage = async (asset: MediaAsset, file: File, quiet = false) => {
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
      const preparedFile = await prepareImageForUpload(file);
      const form = new FormData();
      form.append('file', preparedFile);
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

      if (!quiet) setMessage(`Replaced “${asset.display_name}”, compressed the upload, and generated SEO metadata.`);
      if (!quiet) await loadAssets();
      return true;
    } catch (error) {
      if (!quiet) setMessage(error instanceof Error ? error.message : 'Image upload failed');
      return false;
    } finally {
      setUploading(null);
    }
  };

  const optimizeAll = async () => {
    setOptimizingAll(true);
    setMessage('Optimizing existing website images…');
    let changed = 0;
    try {
      for (const asset of assets) {
        if (asset.optimized_at || !asset.public_url) continue;
        const response = await fetch(asset.public_url);
        if (!response.ok) continue;
        const sourceBlob = await response.blob();
        const sourceFile = new File([sourceBlob], asset.seo_file_name || `${asset.source_key}.jpg`, { type: sourceBlob.type || 'image/jpeg' });
        const prepared = await prepareImageForUpload(sourceFile);
        if (prepared.size < sourceBlob.size && await replaceImage(asset, prepared, true)) changed += 1;
      }
      setMessage(`Image optimization complete. ${changed} image${changed === 1 ? '' : 's'} reduced.`);
      await loadAssets();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image optimization failed');
    } finally {
      setOptimizingAll(false);
    }
  };

  const startCrop = async (asset: MediaAsset, file?: File) => {
    setMessage('');
    try {
      const sourceUrl = file ? URL.createObjectURL(file) : (asset.public_url || asset.local_path);
      if (!sourceUrl) throw new Error('Image source is unavailable');

      const img = new Image();
      img.decoding = 'async';
      img.src = sourceUrl;
      await img.decode();

      const aspectRatio = 4 / 3;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let width = img.naturalWidth;
      let height = width / aspectRatio;
      if (imgAspect < aspectRatio) {
        height = img.naturalHeight;
        width = height * aspectRatio;
      }

      cropImageRef.current = img;
      setCropPreview(sourceUrl);
      setCropData({
        x: (img.naturalWidth - width) / 2,
        y: (img.naturalHeight - height) / 2,
        width,
        height,
      });
      setCropAsset(asset);

      requestAnimationFrame(() => {
        if (cropContainerRef.current) {
          setCropDisplayScale(cropContainerRef.current.offsetWidth / img.naturalWidth);
        }
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open image cropper');
    }
  };

  const handleCropPointerDown = (event: React.PointerEvent, mode: 'move' | 'resize') => {
    event.preventDefault();
    setCropDragging(mode);
    setCropDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleCropPointerMove = (event: PointerEvent) => {
    if (!cropDragging || !cropDragStart || !cropData || !cropImageRef.current) return;
    const scale = cropDisplayScale || 1;
    const dx = (event.clientX - cropDragStart.x) / scale;
    const dy = (event.clientY - cropDragStart.y) / scale;

    if (cropDragging === 'move') {
      const x = Math.max(0, Math.min(cropImageRef.current.naturalWidth - cropData.width, cropData.x + dx));
      const y = Math.max(0, Math.min(cropImageRef.current.naturalHeight - cropData.height, cropData.y + dy));
      setCropData({ ...cropData, x, y });
    } else {
      const nextWidth = Math.max(120, cropData.width + dx);
      const nextHeight = nextWidth / (4 / 3);
      if (
        cropData.x + nextWidth <= cropImageRef.current.naturalWidth &&
        cropData.y + nextHeight <= cropImageRef.current.naturalHeight
      ) {
        setCropData({ ...cropData, width: nextWidth, height: nextHeight });
      }
    }

    setCropDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleCropPointerUp = () => {
    setCropDragging(null);
    setCropDragStart(null);
  };

  useEffect(() => {
    if (!cropDragging) return;
    window.addEventListener('pointermove', handleCropPointerMove);
    window.addEventListener('pointerup', handleCropPointerUp, { once: true });
    return () => {
      window.removeEventListener('pointermove', handleCropPointerMove);
      window.removeEventListener('pointerup', handleCropPointerUp);
    };
  }, [cropDragging, cropDragStart, cropData, cropDisplayScale]);

  const applyCrop = async () => {
    if (!cropAsset || !cropData || !cropImageRef.current) return;
    try {
      setUploading(cropAsset.id);
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not prepare the cropped image');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        cropImageRef.current,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        1600,
        1200,
      );

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86));
      if (!blob) throw new Error('Could not create the cropped image');

      const file = new File([blob], `${cropAsset.source_key}-cropped.webp`, { type: 'image/webp' });
      const asset = cropAsset;
      cancelCrop();
      await replaceImage(asset, file);
    } catch (error) {
      setUploading(null);
      setMessage(error instanceof Error ? error.message : 'Could not apply image crop');
    }
  };

  const cancelCrop = () => {
    setCropAsset(null);
    setCropPreview('');
    setCropData(null);
    cropImageRef.current = null;
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
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={loadAssets} className="border border-[#D4CBBB] px-4 py-2 text-[13px] hover:border-[#2D8C7E]">
            Refresh library
          </button>
          <button type="button" onClick={() => void optimizeAll()} disabled={optimizingAll || loading} className="bg-[#2D8C7E] text-white px-4 py-2 text-[13px] hover:bg-[#1C3A5A] disabled:opacity-50">
            {optimizingAll ? 'Optimizing images…' : 'Optimize existing images'}
          </button>
        </div>
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
                  <img src={preview} alt={asset.alt_text || asset.display_name} className="w-full h-full object-cover" style={{ objectPosition: `${asset.focal_x ?? 50}% ${asset.focal_y ?? 50}%` }} loading="lazy" />
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

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setCropAsset(asset); setCropX(asset.focal_x ?? 50); setCropY(asset.focal_y ?? 50); }} className="border border-[#1C3A5A] text-[#1C3A5A] px-3 py-3 text-[13px] hover:border-[#2D8C7E] hover:text-[#2D8C7E]">
                      Adjust view
                    </button>
                    <button type="button" disabled={busy} onClick={() => inputRefs.current[asset.id]?.click()} className="bg-[#1C3A5A] text-white px-3 py-3 text-[13px] hover:bg-[#2D8C7E] transition-colors disabled:opacity-50">
                      {busy ? 'Replacing…' : 'Replace image'}
                    </button>
                  </div>
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

      {cropAsset && cropData && cropPreview && cropImageRef.current && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-5" onPointerDown={(event) => { if (event.target === event.currentTarget) cancelCrop(); }}>
          <div className="w-full max-w-4xl bg-[#F2EDE4] border border-[#D4CBBB] p-5 lg:p-7">
            <div className="flex items-start justify-between gap-5 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D8C7E]">Visual crop</p>
                <h4 className="font-display text-2xl text-[#1A1714] mt-1">{cropAsset.display_name}</h4>
                <p className="text-[12px] text-[#6B5E4E] mt-1">Drag the white frame to reposition it. Drag the bottom-right handle to resize it.</p>
              </div>
              <button type="button" onClick={cancelCrop} className="text-[#6B5E4E] text-xl">×</button>
            </div>

            <div
              ref={cropContainerRef}
              className="relative max-h-[68vh] overflow-hidden bg-[#D4CBBB] select-none mx-auto w-fit max-w-full"
              style={{ userSelect: 'none' }}
            >
              <img src={cropPreview} alt="" className="block max-w-full max-h-[68vh] w-auto h-auto" draggable={false} />
              <div
                className="absolute inset-0 bg-black/50 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)',
                  opacity: 0.45,
                }}
              />
              <div
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: String((cropData.x / cropImageRef.current.naturalWidth) * 100) + '%',
                  top: String((cropData.y / cropImageRef.current.naturalHeight) * 100) + '%',
                  width: String((cropData.width / cropImageRef.current.naturalWidth) * 100) + '%',
                  height: String((cropData.height / cropImageRef.current.naturalHeight) * 100) + '%',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                }}
                onPointerDown={(event) => handleCropPointerDown(event, 'move')}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[...Array(9)].map((_, i) => <div key={i} className="border border-white/30" />)}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-[#1C3A5A] cursor-nwse-resize"
                  style={{ transform: 'translate(50%, 50%)' }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    handleCropPointerDown(event, 'resize');
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
              <p className="text-[12px] text-[#6B5E4E]">Crop frame: 4:3 · Final output: 1600×1200 WebP</p>
              <div className="flex gap-2">
                <button type="button" onClick={cancelCrop} className="border border-[#D4CBBB] px-5 py-2.5 text-[13px]">Cancel</button>
                <button type="button" disabled={uploading === cropAsset.id} onClick={() => void applyCrop()} className="bg-[#1C3A5A] text-white px-5 py-2.5 text-[13px] hover:bg-[#2D8C7E] disabled:opacity-50">
                  {uploading === cropAsset.id ? 'Uploading…' : 'Apply Crop'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
