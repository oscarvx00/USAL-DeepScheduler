import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport-strategies/jwt-auth.guard';
import { LocalAuthGuard } from './auth/passport-strategies/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService : AuthService,
    private usersService : UsersService) {}

  /*@UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req){
    return this.authService.login(req.user)
  }*/
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req){
    const user = await this.usersService.findOne(req.user.username)
    return user
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
