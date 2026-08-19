import { Controller, Get, Delete, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { GenerationHistoryService } from './generation-history.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('history')
@UseGuards(AuthGuard)
export class GenerationHistoryController {
  constructor(private historyService: GenerationHistoryService) {}

  @Get()
  async list(@Req() req: { user: { sub: string } }) {
    return this.historyService.findByUserId(req.user.sub);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    const deleted = this.historyService.delete(id, req.user.sub);
    if (!deleted) {
      throw new NotFoundException('Generation not found');
    }
    return { success: true };
  }
}
