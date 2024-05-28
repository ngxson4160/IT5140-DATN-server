import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetMessageConversation } from './dto/get-message-conversation.dto';
import { MessageGateway } from '../message/message.gateway';
import { GetListConversation } from './dto/get-list-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Post()
  createConversationPair(
    @UserData() userData: IUserData,
    @Body() body: CreateConversationDto,
  ) {
    return this.messageGateway.createConversationPair(userData.id, body);
  }

  @Get()
  getListConversation(
    @UserData() userData: IUserData,
    @Query()
    data: GetListConversation,
  ) {
    // return this.conversationService.getListConversation(userData.id, data);
    return this.conversationService.getListConversation(userData.id, data);
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
