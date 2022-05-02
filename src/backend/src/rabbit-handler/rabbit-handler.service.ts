import { Injectable } from '@nestjs/common';
import { AmqpConnection, MessageHandlerOptions, Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TrainingRequest } from 'src/schemas/trainingRequest.schema';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import * as amqplib from 'amqplib';
import { Socket } from 'socket.io';

@Injectable()
export class RabbitHandlerService {

    subscriptionHandler : any

    constructor(
        private amqpConnection : AmqpConnection
    ){}
    

    public publishTrainingRequest(request : any){
        this.amqpConnection.publish(
            'backend_exchange',
            'request_queue',
            {id: request._id}
        )
    }

    public publishCancelTrainingRequest(id : any){
        this.amqpConnection.publish(
            'cancel_training_exchange',
            '',
            {id: id}
        )
    }

    public async subscribeToRabbitMessage(socket : Socket, userId : string, handler : (socket : Socket, userId : string, msg : any) => void) : Promise<void>{
        return this.amqpConnection.createSubscriber(
            //this.mHandler.bind(this, socket, userId),
            handler.bind(this, socket, userId),
            {
                exchange: 'orchestrator_msgs_exchange',
                routingKey: userId,
                queue: 'orchestrator_msgs_queue_' + userId,
                queueOptions: {
                    durable: false,
                    exclusive: true
                }
            }
        )
    }

    removeQueues(userId : string){
       this.amqpConnection.channel.deleteQueue('orchestrator_msgs_queue_' + userId) 
    }

    async publishTrainingRequestV2(request : any){
        try{
            return  await this.amqpConnection.request({
                exchange: 'manager_exchange',
                routingKey: '',
                payload: request
            }) 
        } catch {
            return "ERROR"
        }
    }

}
