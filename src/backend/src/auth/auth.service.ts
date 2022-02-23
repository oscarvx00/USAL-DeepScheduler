import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { bcryptConstants } from './strategies/constants';

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
        return null
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
}
