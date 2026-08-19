import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  VirtualTryOnProvider,
  GenerateTryOnParams,
  TryOnGenerationResult,
} from './provider.interface';

@Injectable()
export class ReplicateProvider implements VirtualTryOnProvider {
  readonly name = 'replicate';
  private readonly logger = new Logger(ReplicateProvider.name);

  constructor(private configService: ConfigService) {}

  async generate(params: GenerateTryOnParams): Promise<TryOnGenerationResult> {
    const apiToken = this.configService.get<string>('REPLICATE_API_TOKEN');
    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }

    this.logger.log(`Starting generation with category: ${params.clothingCategory}`);

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'owner/model-version-id',
        input: {
          person_image: params.personImageUrl,
          clothing_image: params.clothingImageUrl,
          category: params.clothingCategory,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    const prediction = await response.json() as { id: string; status: string };

    return {
      id: prediction.id,
      status: prediction.status as TryOnGenerationResult['status'],
    };
  }

  async getStatus(id: string): Promise<TryOnGenerationResult> {
    const apiToken = this.configService.get<string>('REPLICATE_API_TOKEN');
    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    const prediction = await response.json() as {
      id: string;
      status: string;
      output?: string[];
      error?: string;
    };

    return {
      id: prediction.id,
      status: prediction.status as TryOnGenerationResult['status'],
      resultImageUrl: prediction.output?.[0],
      error: prediction.error,
    };
  }
}
