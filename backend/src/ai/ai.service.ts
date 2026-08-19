import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GenerateTryOnDto } from './generate-try-on.dto';
import { VirtualTryOnProvider, TryOnGenerationResult } from './providers';

interface GenerationRecord {
  id: string;
  replicateId: string;
  status: TryOnGenerationResult['status'];
  personImageUrl: string;
  resultImageUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private generations = new Map<string, GenerationRecord>();
  private pollIntervals = new Map<string, ReturnType<typeof setInterval>>();

  constructor(
    @Inject('VIRTUAL_TRYON_PROVIDER')
    private provider: VirtualTryOnProvider,
  ) {}

  async generateTryOn(dto: GenerateTryOnDto): Promise<TryOnGenerationResult> {
    this.logger.log(`Generating try-on with provider: ${this.provider.name}`);

    const result = await this.provider.generate({
      personImageUrl: dto.personImage.url,
      clothingImageUrl: dto.clothingImage.url,
      clothingCategory: dto.clothingCategory,
    });

    const generationId = `gen_${Date.now()}`;
    const record: GenerationRecord = {
      id: generationId,
      replicateId: result.id,
      status: result.status,
      personImageUrl: dto.personImage.url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.generations.set(generationId, record);
    this.startPolling(generationId, result.id);

    return {
      id: generationId,
      status: result.status,
    };
  }

  async getGenerationStatus(id: string): Promise<TryOnGenerationResult> {
    const record = this.generations.get(id);
    if (!record) {
      throw new NotFoundException(`Generation ${id} not found`);
    }

    return {
      id: record.id,
      status: record.status,
      personImageUrl: record.personImageUrl,
      resultImageUrl: record.resultImageUrl,
      error: record.error,
    };
  }

  private startPolling(generationId: string, replicateId: string) {
    const POLL_INTERVAL_MS = 3000;
    const MAX_POLL_TIME_MS = 5 * 60 * 1000; // 5 minutes
    let elapsed = 0;

    const interval = setInterval(async () => {
      elapsed += POLL_INTERVAL_MS;

      if (elapsed >= MAX_POLL_TIME_MS) {
        this.stopPolling(generationId);
        const record = this.generations.get(generationId);
        if (record) {
          record.status = 'failed';
          record.error = 'Generation timed out after 5 minutes';
          record.updatedAt = new Date().toISOString();
        }
        this.logger.warn(`Generation ${generationId} timed out`);
        return;
      }

      try {
        const status = await this.provider.getStatus(replicateId);
        const record = this.generations.get(generationId);
        if (!record) {
          this.stopPolling(generationId);
          return;
        }

        record.status = status.status;
        record.resultImageUrl = status.resultImageUrl;
        record.error = status.error;
        record.updatedAt = new Date().toISOString();

        if (status.status === 'completed' || status.status === 'failed') {
          this.stopPolling(generationId);
          this.logger.log(`Generation ${generationId} finished: ${status.status}`);
        }
      } catch (err) {
        this.logger.error(`Polling error for ${generationId}: ${err}`);
      }
    }, POLL_INTERVAL_MS);

    this.pollIntervals.set(generationId, interval);
  }

  private stopPolling(generationId: string) {
    const interval = this.pollIntervals.get(generationId);
    if (interval) {
      clearInterval(interval);
      this.pollIntervals.delete(generationId);
    }
  }
}
