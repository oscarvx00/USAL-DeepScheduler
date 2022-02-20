import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./passport-strategies/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        console.log("AUTH CONTROLER " + req.user)
        return this.authService.login(req.user)
    }
}