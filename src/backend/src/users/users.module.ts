import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TrainingModule } from 'src/training/training.module';
import { TrainingService } from 'src/training/training.service';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), TrainingModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
