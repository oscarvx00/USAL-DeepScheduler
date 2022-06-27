import { Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { TrainingRequest } from 'src/schemas/trainingRequest.schema';
import { Model } from 'mongoose';
import { RabbitHandlerService } from 'src/rabbit-handler/rabbit-handler.service';
import { MinioHandlerService } from 'src/minio-handler/minio-handler/minio-handler.service';
import { TrainingRequestV2 } from 'src/schemas/trainingRequest_v2.schema';

@Injectable()
export class TrainingService {

    constructor(
        @InjectModel(TrainingRequest.name) private trainingRequestModel : Model<TrainingRequest>,
        @InjectModel(TrainingRequestV2.name) private trainingRequestV2Model : Model<TrainingRequestV2>,
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
       return await this.trainingRequestV2Model.find({user : user._id}).sort({'date':-1}).exec()
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
        return await this.trainingRequestV2Model.findOne({
            user : user._id,
            _id : id
        }).exec()
    }

    async getTrainingRequestResultsUrl(user : any, id : string){
        const filename = `${user._id}/${id}.zip`
        const url =  await this.minioService.getPresignedUrl(filename)
        return {
            url : url
        }
    }

    async removeAllUserTrainingData(userId : string){
        await this.minioService.removeUserData(userId)
        await this.trainingRequestV2Model.deleteMany({user : userId})
    }

    async cancelTrainingRequest(user : any, id : string){
        await this.rabbitService.publishCancelTrainingRequest(id)
        await this.trainingRequestV2Model.findOneAndUpdate(
            {
                _id : id,
                user: user._id
            },
            {status: 'CANCELED'}
          ).exec()
    }

    
    /*{
        imageName: string,
        quadrantStart: number,
        quadrantEnd: number,
        workerId: string
    }*/
    async newTrainingRequestV2(request : any, user : any){     
        
        const newTrainingRequestData = {
            imageName : request.imageName,
            quadrants : this.calculateQuadrants(request.quadrantStart, request.quadrantEnd),
            user : user._id,
            date : new Date(),
            workerId: request.workerId
        }

        return await this.rabbitService.publishTrainingRequestV2(newTrainingRequestData)   
    }

    private calculateQuadrants(qStart : number , qEnd : number) : number[]{
        let arr : number[] = []
        let index = qStart
        arr.push(index)
        index++
        while(index <= qEnd){
            arr.push(index)
            index++
        }
        return arr
    }

    async quandrantIsAvailable(worker : string, quadrant : number) : Promise<boolean> {
        const res = await this.trainingRequestV2Model.findOne({
            quadrants : Number(quadrant),
            worker : worker
        }).exec()

        return res == null
    }

    async stopUserActiveRequests(userId : string){
        const res = await this.trainingRequestV2Model.find({
            user : userId,
            status : {$in : ['SCHEDULED', 'EXECUTING']}
        }).exec()

        for(let tr of res){
            this.cancelTrainingRequest(userId, tr._id.toString())
        }
    }
}
