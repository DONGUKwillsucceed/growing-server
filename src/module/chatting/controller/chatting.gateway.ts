import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { ChattingProxyService } from '../service/chatting-proxy.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
@WebSocketGateway(8080, { transports: ['websocket'] })
export class ChattingGateway {
  constructor(private readonly chattingProxyService: ChattingProxyService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ClientToServer')
  async handleMessage(@MessageBody() data: CreateChattingDto) {
    const dto = plainToInstance(CreateChattingDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      //throw new BadRequestException(errors[0].toString());
    }
    await this.chattingProxyService.create(dto);
    this.server.emit('ServerToClient', data);
  }
}
