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
            status: "SCHEDULED",
            user: user._id,
            date: new Date()
        }).save()
        //console.log(nRequest)
        await this.rabbitService.publishTrainingRequest(nRequest)
        
    }

    async getUserTrainingRequests(user : any){
       return await this.trainingRequestModel.find({user : user._id}).sort({'date':-1}).exec()
    }

    async getUserTrainingStats(user : any){
        //TODO: Store hours of execution
        let res = {}
        let trainingRequests = await this.getUserTrainingRequests(user)
        let hours = 0
        let count = trainingRequests.length
        res["totalContainers"] = count
        res["totalHours"] = hours
        res["imagesByStatus"] = this.getTrainingRequestsCountByStatus(trainingRequests)

        return res
    }

    private getTrainingRequestsCountByStatus(trainingRequests : any){
        let countByType = {
            "COMPLETED" : 0,
            "EXECUTING" : 0,
            "SCHEDULED" : 0,
            "CANCELED" : 0
        }

        trainingRequests.forEach(element => {
            countByType[element.status]++
        });

        //Format result data
        return [
            {
              "name" : "COMPLETED",
              "value" : countByType.COMPLETED
            },
            {
              "name" : "SCHEDULED",
              "value" : countByType.SCHEDULED
            },
            {
              "name" : "EXECUTING",
              "value" : countByType.EXECUTING
            },
            {
              "name" : "CANCELED",
              "value" : countByType.CANCELED
            },
          ]
    }

}
