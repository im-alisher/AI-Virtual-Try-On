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
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upload Images</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Generate Try-On'}
        </button>
      </div>
    </div>
  );
}
