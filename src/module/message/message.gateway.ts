import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ConversationService } from '../conversation/conversation.service';
import { CreateConversationDto } from '../conversation/dto/create-conversation.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  @SubscribeMessage('join_room')
  joinRoom(@MessageBody('id') id: string, @ConnectedSocket() client: Socket) {
    client.join(id);
  }

  @SubscribeMessage('leave_room')
  leaveRoom(@MessageBody('id') id: string, @ConnectedSocket() client: Socket) {
    client.leave(id);
  }

  createConversationPair(userId: number, body: CreateConversationDto) {
    const conversation = this.conversationService.createConversationPair(
      userId,
      body,
    );
    this.server.emit('create_conversation', { conversation });
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
    const conversation = await this.conversationService.getConversationDetail(
      +userId,
      createMessageDto.conversationId,
    );
    if (conversation.messages.length === 1) {
      this.server
        .to(message.conversationId.toString())
        .emit('create_conversation', {
          message,
        });
    } else {
      this.server.to(message.conversationId.toString()).emit('createMessage', {
        message,
      });
    }
  }
}
