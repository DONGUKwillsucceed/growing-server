import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { ChattingProxyService } from '../service/chatting-proxy.service';
import { Injectable } from '@nestjs/common';
import { EnterChattingRoomDto } from '../dto/EnterChattingRoom.dto';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { ConfirmChattingDto } from '../dto/ConfirmChatting.dto';

@Injectable()
@WebSocketGateway(8080, { transports: ['websocket'], cors: true })
@UseFilters(HttpExceptionFilter)
export class ChattingGateway {
  constructor(private readonly chattingProxyService: ChattingProxyService) {}
  @WebSocketServer()
  server: Server;
  wsClients = [];

  @SubscribeMessage('Enter')
  async enterChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) dto: EnterChattingRoomDto,
  ) {
    client.rooms.clear();

    client.data.userId = dto.userId;
    client.join(dto.coupleId);
    this.server.to(dto.coupleId).emit('GetSocketInfo', {
      id: client.id,
      room: dto.coupleId,
    });
    //this.server.emit('getMessage2', { id: client.id });
  }

  @SubscribeMessage('Confirm')
  async confirmMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) dto: ConfirmChattingDto,
  ) {
    const chattingIds = await this.chattingProxyService.confirm(dto);
    this.server.to(dto.coupleId).emit('Confirmed', chattingIds);
  }

  @SubscribeMessage('ClientToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) dto: CreateChattingDto,
  ) {
    const { chattingId } = await this.chattingProxyService.create(dto);
    const chatting = await this.chattingProxyService.findOne(
      chattingId,
      client.data.userId,
    );

    this.server.to(dto.coupleId).emit('ServerToClient', chatting);
  }
}
