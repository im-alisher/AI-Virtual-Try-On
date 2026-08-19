import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  async generate(
    @Body()
    body: {
      personImageUrl: string;
      clothingImageUrl: string;
      clothingCategory: string;
    },
  ) {
    return this.aiService.generateTryOn(body);
  }
}
