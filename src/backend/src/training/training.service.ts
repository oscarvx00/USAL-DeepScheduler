import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrainingRequest } from 'src/schemas/trainingRequest.schema';
import { Model } from 'mongoose';
import { RabbitHandlerService } from 'src/rabbit-handler/rabbit-handler.service';
import { MinioHandlerService } from 'src/minio-handler/minio-handler/minio-handler.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TrainingService {

    constructor(
        @InjectModel(TrainingRequest.name) private trainingRequestModel : Model<TrainingRequest>,
        private rabbitService : RabbitHandlerService,
        private minioService : MinioHandlerService
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
        res["totalHours"] = this.getTotalComputedTime(trainingRequests)
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

    private getTotalComputedTime(trainingRequest : any){
        let count = 0
        trainingRequest.forEach(element => {
            count += element.completedComputingTime
        });
        return Math.floor(count / 3600)
    }

    async getTrainingRequestById(user : any, id : string){
        return await this.trainingRequestModel.findOne({
            user : user._id,
            _id : id
        }).sort({'date':-1}).exec()
    }

    async getTrainingRequestResultsUrl(user : any, id : string){
        const filename = `${user._id}/${id}.zip`
        //TODO: VERIFY USER OWNS REQUEST 
        const url =  await this.minioService.getPresignedUrl(filename)
        return {
            url : url
        }
    }

    async removeAllUserTrainingData(userId : string){
        await this.minioService.removeUserData(userId)
        await this.trainingRequestModel.deleteMany({user : userId})
    }

    async cancelTrainingRequest(user : any, id : string){
        await this.rabbitService.publishCancelTrainingRequest(id)
        await this.trainingRequestModel.findOneAndUpdate(
            {
                _id : id,
                user: user._id
            },
            {status: 'CANCELED'}
          ).exec()
    }

}
