import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTryOnDto } from './generate-try-on.dto';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateTryOnDto) {
    return this.aiService.generateTryOn(dto);
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    return this.aiService.getGenerationStatus(id);
  }
}
