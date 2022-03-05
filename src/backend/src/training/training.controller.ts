import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { TrainingService } from "./training.service";

@Controller('training')
export class TrainingController {
    constructor(
        private trainingService : TrainingService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async newTrainingRequest(@Req() req){
        //console.log(req)
        await this.trainingService.newTrainingRequest(req.body, req.user)
    }
}