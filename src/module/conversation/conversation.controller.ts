import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CreateConversationDto } from './dto/create-conversation.dto';

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
}
