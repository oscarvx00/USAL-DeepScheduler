import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
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

    @Get("/:id")
    async getTrainingRequest(@Req() req, @Param('id') id){
        return await this.trainingService.getTrainingRequestById(req.user, id)
    }

    @Get("/results/:id")
    async getTrainingRequestResultsUrl(@Req() req, @Param('id') id){
        return await this.trainingService.getTrainingRequestResultsUrl(req.user, id)
    }

    @Get("/cancel/:id")
    async cancelTrainingRequest(@Req() req, @Param('id') id){
        return await this.trainingService.cancelTrainingRequest(req.user, id)
    }

}