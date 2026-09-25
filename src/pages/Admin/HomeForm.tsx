import { useState } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import ImageUpload from '../../components/ImageUpload';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-078be9eb`;

interface Home {
  id: string;
  name: string;
  location: string;
  type: string;
  area: string;
  style: string;
  description: string;
  gallery_images: string[];
  status: 'published' | 'draft';
  display_order: number;
  created_at: string;
}

interface Props {
  home: Home | null;
  headers: Record<string, string>;
  onSave: () => void;
  onCancel: () => void;
}

export default function HomeForm({ home, headers, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    name: home?.name || '',
    location: home?.location || '',
    type: home?.type || '3BHK Apartment',
    area: home?.area || '',
    style: home?.style || 'North',
    description: home?.description || '',
    gallery_images: home?.gallery_images || ['', '', '', '', '', '', '', '', '', ''],
    status: home?.status || 'published',
    display_order: home?.display_order || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const types = ['2BHK Apartment', '3BHK Apartment', '4BHK Apartment', 'Independent Villa', 'Duplex', 'Penthouse'];
  const styles = ['North', 'South', 'East', 'West', 'Contemporary'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        name: form.name,
        location: form.location,
        type: form.type,
        area: form.area,
        style: form.style,
        description: form.description,
        gallery_images: form.gallery_images.filter((url) => url.trim()),
        status: form.status,
        display_order: Number(form.display_order),
      };

      const url = home
        ? `${API_BASE}/admin/homes/${home.id}`
        : `${API_BASE}/admin/homes`;
      const method = home ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save home');
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save home');
    }
    setSaving(false);
  };

  const inputClass = 'w-full bg-transparent border border-[#D4CBBB] px-4 py-3 text-[15px] text-[#1A1714] placeholder:text-[#6B5E4E]/50 outline-none focus:border-[#2D8C7E] transition-colors';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display text-xl text-[#1A1714]">
          {home ? 'Edit Home' : 'New Home'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-[14px] text-[#6B5E4E] hover:text-[#1A1714]"
        >
          ← Back to list
        </button>
      </div>

      <div className="border border-[#D4CBBB] p-8" style={{ background: '#EAE4DA' }}>
        <div className="grid gap-6">
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="The Calm Retreat"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Location *</label>
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Noida, UP"
                required
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Type *</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Area *</label>
              <input
                className={inputClass}
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="1,850 sq ft"
                required
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Style *</label>
              <select
                className={inputClass}
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
                required
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Description *</label>
            <textarea
              className={inputClass}
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Modern minimalism with traditional accents..."
              required
            />
          </div>

          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E]">Gallery Images (up to 10)</p>
            <div className="grid gap-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                <ImageUpload
                  key={index}
                  value={form.gallery_images[index] || ''}
                  onChange={(url) => {
                    const newGallery = [...form.gallery_images];
                    newGallery[index] = url;
                    setForm({ ...form, gallery_images: newGallery });
                  }}
                  aspectRatio={1600 / 1060}
                  targetWidth={1600}
                  targetHeight={1060}
                  label={`Image ${index + 1}`}
                  placeholder="Paste URL or upload image"
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">Display Order</label>
              <input
                type="number"
                className={inputClass}
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[13px]">
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1714] text-white text-[14px] px-8 py-3 hover:bg-[#2D8C7E] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : home ? 'Update Home' : 'Create Home'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#D4CBBB] text-[#6B5E4E] text-[14px] px-8 py-3 hover:border-[#1A1714] hover:text-[#1A1714] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
