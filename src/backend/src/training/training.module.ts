import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioHandlerModule } from 'src/minio-handler/minio-handler/minio-handler.module';
import { RabbitHandlerModule } from 'src/rabbit-handler/rabbit-handler.module';
import { RabbitHandlerService } from 'src/rabbit-handler/rabbit-handler.service';
import { TrainingRequest, TrainingRequestSchema } from 'src/schemas/trainingRequest.schema';
import { TrainingGateway } from './training.gateway';
import { TrainingService } from './training.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: TrainingRequest.name, schema: TrainingRequestSchema}]),
    RabbitHandlerModule,
    MinioHandlerModule
],
  providers: [TrainingService, TrainingGateway],
  exports: [TrainingService]
})
export class TrainingModule {}
