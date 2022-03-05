import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TrainingRequest } from 'src/schemas/trainingRequest.schema';

@Injectable()
export class RabbitHandlerService {

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

}
