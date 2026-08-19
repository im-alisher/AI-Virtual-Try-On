import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async generateTryOn(_params: {
    personImageUrl: string;
    clothingImageUrl: string;
    clothingCategory: string;
  }) {
    // TODO: Integrate with Replicate IDM-VTON provider
    throw new Error('AI generation not yet implemented');
  }
}
