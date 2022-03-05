import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitHandlerService } from './rabbit-handler.service';

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            uri: 'amqp://localhost:30001',
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
