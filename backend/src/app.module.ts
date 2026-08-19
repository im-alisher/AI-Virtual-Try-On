import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { GenerationHistoryModule } from './history/generation-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    UploadModule,
    AiModule,
    AuthModule,
    GenerationHistoryModule,
  ],
})
export class AppModule {}
