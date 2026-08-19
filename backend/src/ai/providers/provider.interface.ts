import { ClothingCategory } from 'shared';

export interface GenerateTryOnParams {
  personImageUrl: string;
  clothingImageUrl: string;
  clothingCategory: ClothingCategory;
}

export interface TryOnGenerationResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  personImageUrl?: string;
  resultImageUrl?: string;
  error?: string;
}

export interface VirtualTryOnProvider {
  readonly name: string;
  generate(params: GenerateTryOnParams): Promise<TryOnGenerationResult>;
  getStatus(id: string): Promise<TryOnGenerationResult>;
}
