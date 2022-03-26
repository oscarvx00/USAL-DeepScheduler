import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { MinioHandlerService } from './minio-handler.service';

@Module({
  providers: [MinioHandlerService],
  imports: [
    NestMinioModule.register({
      endPoint: process.env.MINIO_HOST,
      accessKey: process.env.MINIO_ACCESS,
      secretKey: process.env.MINIO_SECRET
    })
  ],
  exports: [MinioHandlerService]
})
export class MinioHandlerModule {}
