import { Injectable } from '@nestjs/common';
import { GenerateTryOnDto } from './generate-try-on.dto';

@Injectable()
export class AiService {
  async generateTryOn(_dto: GenerateTryOnDto) {
    // TODO: Integrate with AI provider
    throw new Error('AI generation not yet implemented');
  }
}
