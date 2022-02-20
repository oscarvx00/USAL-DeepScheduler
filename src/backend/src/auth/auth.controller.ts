import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
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
}