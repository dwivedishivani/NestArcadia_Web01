import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  aspectRatio: number;
  targetWidth: number;
  targetHeight: number;
  label: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  aspectRatio,
  targetWidth,
  targetHeight,
  label,
  placeholder = 'Paste image URL or upload file',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [cropping, setCropping] = useState(false);
  const [cropData, setCropData] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setPreview(e.target?.result as string);
        
        const imgAspect = img.width / img.height;
        let cropWidth, cropHeight;

        if (imgAspect > aspectRatio) {
          cropHeight = img.height;
          cropWidth = cropHeight * aspectRatio;
        } else {
          cropWidth = img.width;
          cropHeight = cropWidth / aspectRatio;
        }

        setCropData({
          x: (img.width - cropWidth) / 2,
          y: (img.height - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
        });
        setCropping(true);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = useCallback(() => {
    if (!imageRef.current || !cropData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(
      imageRef.current,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    onChange(croppedImageUrl);
    setPreview(croppedImageUrl);
    setCropping(false);
    setCropData(null);
  }, [cropData, onChange, targetWidth, targetHeight]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">
        {label} <span className="normal-case tracking-normal text-[10px]">({targetWidth}×{targetHeight})</span>
      </label>

      {!cropping ? (
        <div className="space-y-3">
          <input
            type="text"
            className="w-full border border-[#D4CBBB] px-4 py-2 text-[14px] text-[#1A1714] focus:outline-none focus:border-[#2D8C7E] transition-colors"
            style={{ background: '#FDFCFA' }}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder={placeholder}
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded p-6 text-center transition-colors ${
              isDragging
                ? 'border-[#2D8C7E] bg-[#2D8C7E]/5'
                : 'border-[#D4CBBB] hover:border-[#2D8C7E]'
            }`}
            style={{ background: isDragging ? undefined : '#EAE4DA' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
            
            {preview ? (
              <div className="space-y-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-48 object-contain"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[13px] text-[#1C3A5A] hover:text-[#2D8C7E] transition-colors"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div>
                <p className="text-[13px] text-[#6B5E4E] mb-2">
                  Drag and drop an image here, or
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[13px] text-[#1C3A5A] border-b border-[#1C3A5A] hover:text-[#2D8C7E] hover:border-[#2D8C7E] transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-[#D4CBBB] p-6" style={{ background: '#FDFCFA' }}>
          <div className="relative max-w-2xl mx-auto">
            <img
              src={preview}
              alt="Crop preview"
              className="max-w-full h-auto"
            />
            <p className="text-[12px] text-[#6B5E4E] mt-4 text-center">
              Image will be cropped to {targetWidth}×{targetHeight} maintaining the aspect ratio
            </p>
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <button
              type="button"
              onClick={handleCrop}
              className="bg-[#1C3A5A] text-white text-[13px] px-6 py-2 hover:bg-[#2D8C7E] transition-colors"
            >
              Apply Crop
            </button>
            <button
              type="button"
              onClick={() => {
                setCropping(false);
                setCropData(null);
                setPreview(value);
              }}
              className="border border-[#D4CBBB] text-[#6B5E4E] text-[13px] px-6 py-2 hover:border-[#1A1714] hover:text-[#1A1714] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
