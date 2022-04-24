import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from 'src/schemas/worker.schema';
import { TrainingModule } from 'src/training/training.module';
import { WorkersService } from './workers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Worker.name, schema: WorkerSchema}]),
    TrainingModule
  ],
  providers: [WorkersService],
  exports: [WorkersService]
})
export class WorkersModule {}
