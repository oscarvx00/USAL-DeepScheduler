import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { bcryptConstants } from './strategies/constants';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(
        private usersService : UsersService,
        private jwtService : JwtService
    ) {}

    async validateUser(username : string, password : string) : Promise<any>{
        const user = await this.usersService.findOne(username)
        if(user){           
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(passwordMatch){
                return user;
            }
        }
        throw new NotFoundException('Wrong username or password')
    }

    async login(user : any){
        const payload = {username: user.username, sub: user._id}
        return{
            access_token: this.jwtService.sign(payload)
        }
    }

    async register(user : any){
        const passHash = await bcrypt.hash(user.password, bcryptConstants.saltOrRounds) 
        const mUser = await this.usersService.register(user, passHash)
        return await this.login(mUser)
    }

    async signInWithGoogle(data){
        console.log(data)
        if(!data.user) throw new BadRequestException()

        let user = (await this.usersService.findBy({where : [{googleId : data.user.id}]}))
        if(user) return this.login(user)

        user = (await this.usersService.findBy({ where: [{ email: data.user.email }] }));
        if(user) throw new ForbiddenException('User already exists, but Google account was not connected to user\'s account')

        try {
            const newUser = await this.usersService.registerWithGoogle(data.user.username, data.user.id, data.user.email)
            return this.login(newUser);
        } catch(e) {
            throw new Error(e)
        }
    }
}
