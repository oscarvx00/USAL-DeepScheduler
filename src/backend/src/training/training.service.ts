import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrainingRequest } from 'src/schemas/trainingRequest.schema';
import { Model } from 'mongoose';
import { RabbitHandlerService } from 'src/rabbit-handler/rabbit-handler.service';

@Injectable()
export class TrainingService {

    constructor(
        @InjectModel(TrainingRequest.name) private trainingRequestModel : Model<TrainingRequest>,
        private rabbitService : RabbitHandlerService
    ){}

    async newTrainingRequest(request : any, user : any){
        
        //Deny if user has 2 or more scheduled requests
        const nRequest =  await new this.trainingRequestModel({
            imageName: request.imageName,
            computingTime: request.computingTime,
            state: "scheduled",
            user: user._id
        }).save()
        //console.log(nRequest)
        this.rabbitService.publishTrainingRequest(nRequest)

    }

}
