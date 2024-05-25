import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetMessageConversation } from './dto/get-message-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  createConversationPair(
    @UserData() userData: IUserData,
    @Body() body: CreateConversationDto,
  ) {
    return this.conversationService.createConversationPair(userData.id, body);
  }

  @Get(':id/messages')
  getMessageConversation(
    @UserData() userData: IUserData,
    @Param('id') conversationId: string,
    @Query()
    data: GetMessageConversation,
  ) {
    return this.conversationService.getMessageConversation(
      userData.id,
      +conversationId,
      data,
    );
  }
}
