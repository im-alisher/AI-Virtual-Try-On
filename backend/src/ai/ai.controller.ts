import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTryOnDto } from './generate-try-on.dto';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateTryOnDto) {
    return this.aiService.generateTryOn(dto);
  }
}
