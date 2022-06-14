import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { MinioHandlerService } from './minio-handler.service';

@Module({
  providers: [MinioHandlerService],
  imports: [
    NestMinioModule.register({
      endPoint: process.env.MINIO_HOST,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS,
      secretKey: process.env.MINIO_SECRET,
      useSSL: false
    })
  ],
  exports: [MinioHandlerService]
})
export class MinioHandlerModule {}
