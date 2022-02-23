import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try{
        return await new this.userModel({
        username : user.username,
        password: passHash,
        mail: user.mail
      }).save()
    } catch (e){
      let msg = ""
      switch(e.code){
        case 11000:
          Object.keys(e.keyPattern).forEach(key =>{
            msg += e.keyValue[key] + " already exists"
          })
          console.log(msg)
          break;
        default:
          msg = e.message
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: msg
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
