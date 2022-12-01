import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';

@WebSocketGateway(8080, { transports: ['websocket'] })
export class ChattingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ClientToServer')
  async handleMessage(@MessageBody() data: CreateChattingDto) {
    this.server.emit('ServerToClient', data);
  }
}
