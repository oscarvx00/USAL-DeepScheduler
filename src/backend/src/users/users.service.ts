import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { bcryptConstants } from 'src/auth/strategies/constants';
import { TrainingService } from 'src/training/training.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel : Model<UserDocument>,
    private trainingService : TrainingService,
    private mailService : MailService
  ){}

  async findOne(username: string): Promise<User | undefined> {
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

  async registerWithGitlab(username : string, gitlabId : string, mail : string){
    try{
      return await new this.userModel({
        username : username,
        gitlabId : gitlabId,
        mail : mail,
        mailVerified : true //Mail may be null, but as we do not send confirmation code we must put it as verified
      }).save()
    } catch(e) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async changePassword(currentPass : string, newPass : string, username : string){

    const user = await this.findOne(username)
        if(user){           
            const passwordMatch = await bcrypt.compare(currentPass, user.password)
            if(passwordMatch){
                 const passHash = await bcrypt.hash(newPass, bcryptConstants.saltOrRounds)
                 const result = await this.updateUser(username, {password : passHash}) 
                 return
            }
        }
        throw new UnauthorizedException('Wrong password')
  }

  async updateUser(username : string, updateParams : any){
    return await this.userModel.findOneAndUpdate(
      {username : username},
      updateParams
    ).exec()
  }

  async removeUserInit(mUser : any){
    const user = await this.findOne(mUser.username)

    if(user){
      const code = Math.floor(100000 + Math.random() * 900000)
      this.updateUser(
        user.username,
        {
          removeAccountCode : code
        }
      )
      this.mailService.sendUserRemoveCode(user, code)
    }
  }

  async removeUserConfirm(mUser : any, confirmationCode : number){
    const user = await this.findOne(mUser.username)
    
        if(user){     
            if(confirmationCode == user.removeAccountCode){
              //Also stop all running images
                await this.trainingService.removeAllUserTrainingData(mUser._id)
                await this.userModel.deleteOne({username : user.username})
                return
            }    
        }
        throw new UnauthorizedException('Wrong confirmation code')
  }
}
