import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import { WorkersService } from "./workers.service";

@Controller('workers')
export class WorkersController{

    constructor(
        private workersService : WorkersService
    ) {}

    @Get(':id')
    async getWorkerQuadrants(@Req() req,@Param('id') id, @Query('startQ') startQ, @Query('endQ') endQ){
        return await this.workersService.getWorkerQuadrants(id, startQ, endQ)
    }

}