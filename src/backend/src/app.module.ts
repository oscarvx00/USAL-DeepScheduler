import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, MongooseModule.forRoot('mongodb://localhost:30002/ds')],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService],
})
export class AppModule {}
