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
import { ReadMessageDto } from './dto/read-message.dto';
import { EConversationStatus } from 'src/_core/constant/enum.constant';

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

  async createConversationPair(userId: number, body: CreateConversationDto) {
    const conversation = await this.conversationService.createConversationPair(
      userId,
      body,
    );

    if (conversation.status === EConversationStatus.NOT_ACTIVE) {
      const payload = {
        conversationId: conversation.id,
        fromUserId: userId,
        toUserId: body.withUserId,
      };
      this.server.emit('create_conversation', { payload });
    }

    return conversation;
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

    const count = await this.conversationService.countConversationUnread(
      createMessageDto.toUserId,
    );

    this.server
      .to(createMessageDto.toUserId.toString())
      .emit('count_conversation_unread', {
        count,
      });
  }

  @SubscribeMessage('read_conversation')
  async readMessage(
    @MessageBody() readMessageDto: ReadMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.headers['userid'];
    const message = await this.conversationService.readConversation(
      +userId,
      readMessageDto,
    );

    this.server
      .to(readMessageDto.conversationId.toString())
      .emit('read_conversation', {
        message,
      });

    const count = await this.conversationService.countConversationUnread(
      +userId,
    );

    this.server.to(userId).emit('count_conversation_unread', {
      count,
    });
  }

  @SubscribeMessage('count_conversation_unread')
  async countConversationUnread(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.headers['userid'];

    const count = this.conversationService.countConversationUnread(+userId);

    return count;
  }
}
