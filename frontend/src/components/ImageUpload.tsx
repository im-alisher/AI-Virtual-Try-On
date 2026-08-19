import { useCallback, useRef, useState } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;

interface Props {
  label: string;
  onUpload: (file: File) => void;
  preview?: string | null;
  disabled?: boolean;
}

export default function ImageUpload({ label, onUpload, preview, disabled }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): boolean => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, JPEG, and PNG files are allowed');
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (validate(file)) {
        onUpload(file);
      }
    },
    [validate, onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between"><p className="font-bold text-[#26342b]">{label}</p><span className="text-xs font-semibold text-[#8a928b]">Required</span></div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          group relative w-full h-72 border border-dashed rounded-[20px] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${dragOver ? 'border-[#62836b] bg-[#eff5e9]' : 'border-[#cdd3cb] bg-[#fafaf7] hover:border-[#7e9785] hover:bg-[#f5f7f1]'}
        `}
      >
        {preview ? (
          <><img src={preview} alt={label} className="h-full w-full object-contain p-3" /><span className="absolute bottom-3 rounded-full bg-[#173f2d]/90 px-3 py-1.5 text-xs font-bold text-white">Click to replace</span></>
        ) : (
          <>
            <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e8efe3] text-[#41634c] transition-transform group-hover:-translate-y-1"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg></span><p className="font-bold text-[#35433a]">Drop your image here</p><p className="mt-1 text-sm text-[#7d867f]">or <span className="font-bold text-[#4d7257]">browse files</span></p><p className="text-xs text-[#9ba19c] mt-4">JPG or PNG · Max {MAX_SIZE_MB}MB</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
