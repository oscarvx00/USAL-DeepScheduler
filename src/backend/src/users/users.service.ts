import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

// This should be a real class/interface representing a user entity
//export type User = any;

@Injectable()
export class UsersService {
  /*private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];*/

  constructor(
    @InjectModel(User.name) private userModel : Model<UserDocument>
  ){}

  async findOne(username: string): Promise<User | undefined> {
    //return this.users.find(user => user.username === username);
    return this.userModel.findOne({username: username}).exec()
  }

  async register(user : any, passHash : string){
    return await new this.userModel({
      username : user.username,
      password: passHash,
      mail: user.mail
    }).save()
  }
}
