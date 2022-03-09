import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { TrainingService } from "./training.service";

@Controller('training')
@UseGuards(JwtAuthGuard)
export class TrainingController {
    constructor(
        private trainingService : TrainingService
    ) {}

    @Post()
    async newTrainingRequest(@Req() req){
        //console.log(req)
        await this.trainingService.newTrainingRequest(req.body, req.user)
    }

    @Get()
    async getUserTrainingRequests(@Req() req){
        return await this.trainingService.getUserTrainingRequests(req.user)
    }

    @Get("/stats")
    async getUserTrainingStats(@Req() req){
        return await this.trainingService.getUserTrainingStats(req.user)
    }
}