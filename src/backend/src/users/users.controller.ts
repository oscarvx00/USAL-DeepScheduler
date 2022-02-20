import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { UsersService } from "./users.service";


@Controller('user')
export class UsersController{

    constructor(
        private usersService : UsersService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUser(@Request() req){
        const user = await this.usersService.findOne(req.user.username)
        return {username : user.username}
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req){
      const user = await this.usersService.findOne(req.user.username)
      return user
    }

}