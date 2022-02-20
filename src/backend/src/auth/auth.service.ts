import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService : UsersService,
        private jwtService : JwtService
    ) {}

    async validateUser(username : string, password : string) : Promise<any>{
        const user = await this.usersService.findOne(username)
        console.log("VALIDATE!" + user)
        if(user && user.password == password){
            //const {password, ...result} = user;
            return user;
        }
        return null
    }

    async login(user : any){
        const payload = {username: user.username, sub: user.mail}
        return{
            access_token: this.jwtService.sign(payload)
        }
    }
}
