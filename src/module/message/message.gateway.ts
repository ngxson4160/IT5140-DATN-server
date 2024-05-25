import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('join_room')
  joinRoom(@MessageBody('id') id: string, @ConnectedSocket() client: Socket) {
    client.join(id);
  }

  @SubscribeMessage('leave_room')
  leaveRoom(@MessageBody('id') id: string, @ConnectedSocket() client: Socket) {
    client.leave(id);
  }

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.headers['userid'];
    const message = await this.messageService.createMessage(
      +userId,
      createMessageDto,
    );
    this.server.to(message.conversationId.toString()).emit('createMessage', {
      message,
    });
  }

  @SubscribeMessage('findAllMessage')
  findAll() {
    return this.messageService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messageService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messageService.remove(id);
  }
}
