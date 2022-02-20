import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/strategies/jwt-auth.guard';
import { LocalAuthGuard } from './auth/strategies/local-auth.guard';
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
  


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
