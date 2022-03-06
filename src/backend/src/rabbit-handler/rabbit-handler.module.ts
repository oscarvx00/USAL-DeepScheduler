import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitHandlerService } from './rabbit-handler.service';

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            uri: 'amqp://' + process.env.RABBIT_HOST,
            /*channels: {
                'request_queue': {

                }
            }*/
            /*exchanges: [
                {
                    name: 'backend_exchange',
                    type: 'direct',
                }
            ],*/
        })
    ],
    providers: [RabbitHandlerService],
    exports: [RabbitHandlerService]
})
export class RabbitHandlerModule {}
