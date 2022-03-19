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

    public async subscribeToUser(socket : Socket, userId : string) : Promise<void>{
        let check =  this.amqpConnection.createSubscriber(
            this.handler.bind(this, socket),
            {
                exchange: 'direct_logs',
                routingKey: userId,
                queue: userId,
                queueOptions: {
                    durable: false,
                    exclusive: true
                }
            }
        )
        console.log(check)
        return check


    }

    removeQueue(userId : string){
       this.amqpConnection.channel.deleteQueue(userId) 
    }

    handler(socket : Socket, msg : {}) : Promise<Nack>{
        console.log(msg)
        socket.emit('rabbit', msg)
        return undefined
    }

}
