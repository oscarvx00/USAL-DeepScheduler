import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrainingService } from 'src/training/training.service';
import { Model } from 'mongoose';
import { Worker } from 'src/schemas/worker.schema';

@Injectable()
export class WorkersService {

    constructor(
        private trainingService : TrainingService,
        @InjectModel(Worker.name) private workerModel : Model<Worker>
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

    async getAllWorkers(){
        return await this.workerModel.find()
    }

}
