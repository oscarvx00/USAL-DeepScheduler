import { Controller, Get, UseGuards, Request, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController{

    constructor(
        private usersService : UsersService,
    ) {}

    @Get('profile/basic')
    async getUser(@Request() req){
        const user = await this.usersService.findOne(req.user.username)
        return {username : user.username}
    }

    @Get('profile')
    async getProfile(@Request() req){
      const user = await this.usersService.findOne(req.user.username)
      return {
          username : user.username,
          mail : user.mail,
          hasPassword : (user.password != undefined)
      }
    }

    @Post('changePassword')
    async changePassword(@Request() req){
        this.usersService.changePassword(req.body.currentPass, req.body.newPass, req.user.username)
    }

    @Get("remove/init")
    async removeAccount(@Request() req){
        this.usersService.removeUserInit(req.user)
    }

    @Post("remove/confirm")
    async removeUserConfirm(@Request() req){
        this.usersService.removeUserConfirm(req.user, req.body.confirmationCode)
    }

}