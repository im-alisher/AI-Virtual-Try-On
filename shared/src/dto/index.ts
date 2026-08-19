export interface UploadImageDto {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export interface GenerateTryOnDto {
  personImage: UploadImageDto;
  clothingImage: UploadImageDto;
  clothingCategory: import('./clothing.dto').ClothingCategory;
}

export interface TryOnResultDto {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultImageUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TryOnStatusDto {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  resultImageUrl?: string;
  error?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
