import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { bcryptConstants, jwtConstants } from './strategies/constants';
import { NotFoundError } from 'rxjs';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService : UsersService,
        private jwtService : JwtService,
        private mailService : MailService
    ) {}

    async validateUser(username : string, password : string) : Promise<any>{
        const user = await this.usersService.findOne(username)
        if(user){           
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(passwordMatch){
                if(user.mailVerified){
                    return user;
                } else{
                    throw new UnauthorizedException('Account not activated. Please verify your email')
                }    
            }
        }
        throw new UnauthorizedException('Wrong username or password')
    }

    async login(user : any){
        const payload = {username: user.username, sub: user._id}
        return{
            access_token: this.jwtService.sign(payload)
        }
    }

    async register(user : any){
        const token = this.jwtService.sign({mail : user.mail})
        const passHash = await bcrypt.hash(user.password, bcryptConstants.saltOrRounds) 
        const mUser = await this.usersService.register(user, passHash, token)
        await this.mailService.sendUserConfirmation(mUser, token)
    }

    async signInWithGoogle(data){
        //console.log(data)
        if(!data.user || !data.user.id) throw new BadRequestException()

        let user = (await this.usersService.findBy({googleId : data.user.id}))
        if(user) return this.login(user)

        user = (await this.usersService.findBy({ mail: data.user.email }));
        if(user) throw new ForbiddenException('User already exists, but Google account was not connected to user\'s account')

        try {
            const newUser = await this.usersService.registerWithGoogle(data.user.username, data.user.id, data.user.email)
            return this.login(newUser);
        } catch(e) {
            throw new Error(e)
        }
    }

    async signInWithGithub(data){
        console.log(data)
        if(!data.user || !data.user.id) throw new BadRequestException();

        let user = (await this.usersService.findBy({githubId : data.user.id}))
        if(user) return this.login(user)

        if(data.user.email && data.user.email != null){
            user = (await this.usersService.findBy({mail: data.user.email}))
            if(user) throw new ForbiddenException('User already exists, but Github account was not connected to user\'s account')
        }

        try {
            const newUser = await this.usersService.registerWithGithub(data.user.username, data.user.id, data.user.email)
            return this.login(newUser)
        } catch (e) {
            throw new Error(e)
        }   
    }

    async signInWithGitlab(data){
        console.log(data)
        if(!data.user || !data.user.id) throw new BadRequestException();

        let user = (await this.usersService.findBy({gitlabId : data.user.id}))
        if(user) return this.login(user)

        if(data.user.email && data.user.email != null){
            user = (await this.usersService.findBy({mail: data.user.email}))
            if(user) throw new ForbiddenException('User already exists, but Gitlab account was not connected to user\'s account')
        }

        try {
            const newUser = await this.usersService.registerWithGitlab(data.user.username, data.user.id, data.user.email)
            return this.login(newUser)
        } catch (e) {
            throw new Error(e)
        }   
    }
}
