import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [MessageModule],
  providers: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
