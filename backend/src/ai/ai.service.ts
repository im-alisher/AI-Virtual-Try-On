import { Inject, Injectable, Logger } from '@nestjs/common';
import { GenerateTryOnDto } from './generate-try-on.dto';
import { VirtualTryOnProvider, TryOnGenerationResult } from './providers';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject('VIRTUAL_TRYON_PROVIDER')
    private provider: VirtualTryOnProvider,
  ) {}

  async generateTryOn(dto: GenerateTryOnDto): Promise<TryOnGenerationResult> {
    this.logger.log(`Generating try-on with provider: ${this.provider.name}`);

    return this.provider.generate({
      personImageUrl: dto.personImage.url,
      clothingImageUrl: dto.clothingImage.url,
      clothingCategory: dto.clothingCategory,
    });
  }

  async getGenerationStatus(id: string): Promise<TryOnGenerationResult> {
    return this.provider.getStatus(id);
  }
}
