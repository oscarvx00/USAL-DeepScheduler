import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitHandlerModule } from 'src/rabbit-handler/rabbit-handler.module';
import { RabbitHandlerService } from 'src/rabbit-handler/rabbit-handler.service';
import { TrainingRequest, TrainingRequestSchema } from 'src/schemas/trainingRequest.schema';
import { TrainingService } from './training.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: TrainingRequest.name, schema: TrainingRequestSchema}]),
    RabbitHandlerModule
],
  providers: [TrainingService],
  exports: [TrainingService]
})
export class TrainingModule {}
