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
            exchanges: [
                {
                    name: 'direct_logs',
                    type: 'topic',
                }
            ],
        })
    ],
    providers: [RabbitHandlerService],
    exports: [RabbitHandlerService]
})
export class RabbitHandlerModule {}
