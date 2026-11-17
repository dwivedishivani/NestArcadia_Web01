import { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: number;
  targetWidth?: number;
  targetHeight?: number;
}

/**
 * ImageUpload — URL input + optional file-to-data-URL fallback.
 * Used in the Admin blog form to set an article cover image.
 */
export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  placeholder = 'Paste image URL',
  targetWidth = 1200,
  targetHeight = 700,
}: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const inputClass =
    'w-full bg-transparent border border-[#D4CBBB] px-4 py-3 text-[15px] text-[#1A1714] ' +
    'placeholder:text-[#6B5E4E]/50 outline-none focus:border-[#17665B] transition-colors';

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setError('');
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      // Optionally resize via canvas before passing on
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(targetWidth / img.width, targetHeight / img.height, 1);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          onChange(canvas.toDataURL('image/webp', 0.88));
        } else {
          onChange(src);
        }
        setUploading(false);
      };
      img.onerror = () => {
        onChange(src);
        setUploading(false);
      };
      img.src = src;
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && (
        <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">
          {label}
        </label>
      )}

      <div className="flex gap-3 items-stretch">
        <input
          type="url"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 border border-[#D4CBBB] px-4 text-[13px] text-[#6B5E4E] hover:border-[#17665B] hover:text-[#1A1714] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? 'Processing…' : 'Upload file'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {error && (
        <p className="text-[12px] text-red-600 mt-1">{error}</p>
      )}

      {value && (
        <div className="mt-3 border border-[#D4CBBB] overflow-hidden" style={{ maxHeight: 180 }}>
          <img
            src={value}
            alt="Preview"
            className="w-full object-cover"
            style={{ maxHeight: 180 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}
