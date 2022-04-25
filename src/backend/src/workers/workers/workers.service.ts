import { Injectable } from '@nestjs/common';
import { TrainingService } from 'src/training/training.service';

@Injectable()
export class WorkersService {

    constructor(
        private trainingService : TrainingService
    ) {}


    async getWorkerQuadrants(worker : string, startQ : number, endQ : number){
        let quadrants = []

        for(let i = Number(startQ); i <= endQ; i++){
            let quadrantRes = await this.trainingService.quandrantIsAvailable(worker, i)

            quadrants.push({
                quadrant: i,
                available : quadrantRes
            })
        }
        return {
            quadrants : quadrants
        }
    }

}
