import { Controller, Get, NotFoundException, Param, Post, Query, Req, Request, Res, UseGuards } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./strategies/google-auth.guard";
import { LocalAuthGuard } from "./strategies/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService,
        private usersService : UsersService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        return this.authService.login(req.user)
    }

    @Post('register')
    async register(@Request() req){
        return await this.authService.register(req.body)
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async signInWthGoogle(){ }

    @UseGuards(GoogleAuthGuard)
    @Get('google/redirect')
    async signInWithGoogleRedirect(@Req() req, @Res() res){
        let token = await this.authService.signInWithGoogle(req)
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({
        res : token
        }));
        res.status(200).send(responseHTML)
    }

    @Get('confirm')
    async confirmUserMail(@Req() req, @Query('token') token : string){
        let user = await this.usersService.findBy({confirmationCode : token})
        if(!user){
            throw new NotFoundException('User not found')
        }

        user.mailVerified = true
        await this.usersService.save(user)
        //Build response HTML
    }
}