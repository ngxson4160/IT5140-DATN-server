import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MessageController } from './message.controller';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  providers: [MessageGateway, MessageService, ConversationService],
  controllers: [MessageController],
  exports: [MessageGateway, MessageService, ConversationService],
})
export class MessageModule {}
