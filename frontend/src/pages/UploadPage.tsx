import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import ClothingCategorySelector from '../components/ClothingCategorySelector';
import api from '../lib/api';
import type { ClothingCategory, UploadImageDto } from 'shared';

export default function UploadPage() {
  const navigate = useNavigate();
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);
  const [clothingCategory, setClothingCategory] = useState<ClothingCategory | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePersonUpload = useCallback((file: File) => {
    setPersonFile(file);
    setPersonPreview(URL.createObjectURL(file));
    setError(null);
  }, []);

  const handleClothingUpload = useCallback((file: File) => {
    setClothingFile(file);
    setClothingPreview(URL.createObjectURL(file));
    setError(null);
  }, []);

  const canGenerate = personFile && clothingFile && clothingCategory && !uploading;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setUploading(true);
    setError(null);

    try {
      const formData1 = new FormData();
      formData1.append('file', personFile);
      const personRes = await api.post<UploadImageDto>('/api/upload/person', formData1);

      const formData2 = new FormData();
      formData2.append('file', clothingFile);
      const clothingRes = await api.post<UploadImageDto>('/api/upload/clothing', formData2);

      const generateRes = await api.post<{ id: string }>('/api/ai/generate', {
        personImage: personRes.data,
        clothingImage: clothingRes.data,
        clothingCategory,
      });

      navigate(`/result/${generateRes.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [personFile, clothingFile, clothingCategory, canGenerate, navigate]);

  return (
    <main className="app-container py-10 sm:py-14">
      <div className="mx-auto mb-10 max-w-2xl text-center"><div className="mb-4 inline-flex rounded-full bg-[#e8efd9] px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-[#527047]">Virtual fitting room</div><h1 className="display-font text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">Create your next look</h1><p className="mt-4 text-lg text-[#68726b]">Two images are all it takes. For the best result, use well-lit photos with a simple background.</p></div>
      <div className="surface mx-auto max-w-5xl p-5 sm:p-8">
      <div className="mb-7 flex items-center justify-center gap-3 text-xs font-bold text-[#657068]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#173f2d] text-white">1</span><span>Upload</span><span className="h-px w-10 bg-[#d8dcd6]"/><span className="grid h-7 w-7 place-items-center rounded-full bg-[#edf0eb]">2</span><span>Generate</span><span className="h-px w-10 bg-[#d8dcd6]"/><span className="grid h-7 w-7 place-items-center rounded-full bg-[#edf0eb]">3</span><span>Enjoy</span></div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-8">
        <ImageUpload
          label="Person Photo"
          onUpload={handlePersonUpload}
          preview={personPreview}
          disabled={uploading}
        />
        <ImageUpload
          label="Clothing Image"
          onUpload={handleClothingUpload}
          preview={clothingPreview}
          disabled={uploading}
        />
      </div>
      <ClothingCategorySelector
        selected={clothingCategory}
        onSelect={setClothingCategory}
        disabled={uploading}
      />
      {error && <p className="mx-auto mb-4 max-w-xl rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">{error}</p>}
      <div className="text-center border-t border-[#e8e8e0] pt-6">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="btn-primary min-w-[220px] !py-4"
        >
          {uploading ? 'Creating your look...' : 'Generate my try-on  ✦'}
        </button>
        <p className="mt-3 text-xs text-[#899088]">Your photos are processed securely.</p>
      </div></div>
    </main>
  );
}
