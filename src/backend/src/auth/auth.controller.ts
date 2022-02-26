import { Controller, Get, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./strategies/google-auth.guard";
import { LocalAuthGuard } from "./strategies/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        return this.authService.login(req.user)
    }

    @Post('register')
    async register(@Request() req){
        //Check if user or mail already exists
        return this.authService.register(req.body)
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
}