import { Controller, Get, NotFoundException, Param, Post, Query, Req, Request, Res, UseGuards } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { GithubAuthGuard } from "./strategies/github-auth.guard";
import { GitlabAuthGuard } from "./strategies/gitlab-auth.guard";
import { GoogleAuthGuard } from "./strategies/google-auth.guard";
import { LocalAuthGuard } from "./strategies/local-auth.guard";
import * as fs from 'fs'
import * as path from 'path'

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

    @Get('confirm')
    async confirmUserMail(@Req() req, @Query('token') token : string){
        let user = await this.usersService.findBy({confirmationCode : token})
        if(!user){
            throw new NotFoundException('User not found')
        }

        user.mailVerified = true
        await this.usersService.save(user)
        return fs.readFileSync(
            path.resolve(
                __dirname,
                '../static-content/registrationCompleted.html'
            )
        ).toString()

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

    @UseGuards(GithubAuthGuard)
    @Get('github')
    async signInWithGithub() { }

    @UseGuards(GithubAuthGuard)
    @Get('github/redirect')
    async signInWithGithubRedirect(@Req() req, @Res() res){
        let token = await this.authService.signInWithGithub(req)
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({
        res : token
        }));
        res.status(200).send(responseHTML)
    }

    @UseGuards(GitlabAuthGuard)
    @Get('gitlab')
    async signInWithGitlab() { }

    @UseGuards(GitlabAuthGuard)
    @Get('gitlab/redirect')
    async signInWithGitlabRedirect(@Req() req, @Res() res){
        let token = await this.authService.signInWithGitlab(req)
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({
        res : token
        }));
        res.status(200).send(responseHTML)
    }
}