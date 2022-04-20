import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    WsResponse,
  } from '@nestjs/websockets';

import * as jwt from 'jsonwebtoken'


import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/strategies/constants';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { WsGuard } from 'src/auth/strategies/ws.strategy';
import { RabbitHandlerService } from 'src/rabbit-handler/rabbit-handler.service';
import { TrainingService } from './training.service';

@WebSocketGateway(3001, {
    cors: {
        origin: '*'
    }
})

export class TrainingGateway implements OnGatewayDisconnect{
    @WebSocketServer() server : Server

    constructor(
        private rabbitService : RabbitHandlerService,
        private trainingService : TrainingService
    ){}

    @UseGuards(WsGuard)
    @SubscribeMessage('socket_init')
    handleRabbitMessage(client : Socket, data : any){
        const token = client.handshake.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtConstants.secret)
        const userId : string = decoded.sub as string
        this.rabbitService.subscribeToRabbitMessage(client, userId, this.rabbitMessageHandler)
    }

    async rabbitMessageHandler(socket : Socket, userId : string, msg : any){
        if(!msg.type){
            return undefined
        }
        
        const emitMsg : TrainingGatewayDTO = {
            type : msg.type,
            data : msg.message
        }

        socket.emit(msg.type, emitMsg)
        return undefined
    }

    @UseGuards(WsGuard)
    handleDisconnect(client: any) {
        const token = client.handshake.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtConstants.secret)
        const userId : string = decoded.sub as string
        this.rabbitService.removeQueues(userId)
    }
}

interface TrainingGatewayDTO{
    type : "request_status" | "request_log",
    data : {}
}