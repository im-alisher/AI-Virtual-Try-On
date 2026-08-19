import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ReplicateProvider } from './providers';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'VIRTUAL_TRYON_PROVIDER',
      useClass: ReplicateProvider,
    },
  ],
})
export class AiModule {}
