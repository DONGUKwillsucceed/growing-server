import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { ChattingProxyService } from '../service/chatting-proxy.service';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EnterChattingRoomDto } from '../dto/EnterChattingRoom.dto';

@Injectable()
@WebSocketGateway(8080, { transports: ['websocket'] })
export class ChattingGateway {
  constructor(private readonly chattingProxyService: ChattingProxyService) {}
  @WebSocketServer()
  server: Server;
  wsClients = [];

  @SubscribeMessage('Enter')
  async enterChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EnterChattingRoomDto,
  ) {
    const dto = plainToInstance(EnterChattingRoomDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new WsException(errors[0].toString());
    }
    client.rooms.clear();

    client.data.userId = dto.userId;
    client.join(dto.coupleId);
    this.server.to(dto.coupleId).emit('GetSocketInfo', {
      id: client.id,
      room: dto.coupleId,
    });
    //this.server.emit('getMessage2', { id: client.id });
  }

  @SubscribeMessage('ClientToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateChattingDto,
  ) {
    const dto = plainToInstance(CreateChattingDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new WsException(errors[0].toString());
    }
    const { chattingId } = await this.chattingProxyService.create(dto);
    const chatting = await this.chattingProxyService.findOne(
      chattingId,
      client.data.userId,
    );

    this.server.to(dto.coupleId).emit('ServerToClient', chatting);
  }
}
