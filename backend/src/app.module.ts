import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { GenerationHistoryModule } from './history/generation-history.module';
import {
  SecurityHeadersMiddleware,
  RateLimitMiddleware,
  RequestLoggingMiddleware,
} from './common/middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityHeadersMiddleware, RateLimitMiddleware, RequestLoggingMiddleware)
      .forRoutes('*');
  }
}
