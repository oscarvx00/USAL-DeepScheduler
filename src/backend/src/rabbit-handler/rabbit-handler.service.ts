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

    /*@RabbitSubscribe({
        exchange: 'direct_logs',
        routingKey: 'user1',
        queue: 'q1' 
    })
    public async pubSubHandler(msg: {}){
        console.log("HALLO") 
        console.log(msg)
    }*/

    public async subscribeToUser(socket : Socket, userId : string, handler : (socket : Socket, userId : string, msg : any) => void) : Promise<void>{
        return this.amqpConnection.createSubscriber(
            //this.mHandler.bind(this, socket, userId),
            handler.bind(this, socket, userId),
            {
                exchange: 'requestsStatus',
                routingKey: userId,
                queue: 'requestsStatus_' + userId,
                queueOptions: {
                    durable: false,
                    exclusive: true
                }
            }
        )
    }

    mHandler(socket : Socket, userId : string,  msg : {}){
        console.log(msg)
        socket.emit('requestsStatus', msg)
        return undefined
    }

    removeQueues(userId : string){
       this.amqpConnection.channel.deleteQueue('requestsStatus_' + userId) 
    }

}
