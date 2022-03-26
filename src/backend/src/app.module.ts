import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TrainingModule } from './training/training.module';
import { TrainingController } from './training/training.controller';
import { RabbitHandlerModule } from './rabbit-handler/rabbit-handler.module';
import { MinioHandlerModule } from './minio-handler/minio-handler/minio-handler.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    MongooseModule.forRoot("mongodb://" + process.env.MONGO_HOST), TrainingModule, RabbitHandlerModule, MinioHandlerModule,
  ],
  controllers: [AppController, AuthController, UsersController, TrainingController],
  providers: [AppService],
})
export class AppModule {}

//'mongodb://localhost:30002/ds'