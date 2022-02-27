import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel : Model<UserDocument>
  ){}

  async findOne(username: string): Promise<User | undefined> {
    //return this.users.find(user => user.username === username);
    return this.userModel.findOne({username: username}).exec()
  }

  async findBy(req : any): Promise<User | undefined> {
    return this.userModel.findOne(req).exec()
  }

  async register(user : any, passHash : string, confirmationCode : string){
    try{
        return await new this.userModel({
        username : user.username,
        password: passHash,
        mail: user.mail,
        confirmationCode: confirmationCode
      }).save()
    } catch (e){
      let msg = ""
      switch(e.code){
        case 11000:
          Object.keys(e.keyPattern).forEach(key =>{
            msg += e.keyValue[key] + " already exists"
          })
          break;
        default:
          msg = e.message
      }
      throw new InternalServerErrorException(msg)
    }
  }

  async save(user : User){
    try{
      return await this.userModel
        .findOneAndUpdate({mail : user.mail}, user).exec()
    } catch (e){
      throw new InternalServerErrorException(e.message)
    }
  }

  async registerWithGoogle(username : string, googleId : string,  mail : string){
    try{
      return await new this.userModel({
        username : username,
        googleId : googleId,
        mail : mail,
        mailVerified: true
      }).save()
    } catch(e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async registerWithGithub(username : string, githubId : string, mail : string){
    try{
      return await new this.userModel({
        username : username,
        githubId : githubId,
        mail : mail,
        mailVerified : true //Mail may be null, but as we do not send confirmation code we must put it as verified
      }).save()
    } catch(e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
