import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(userId: number, data: CreateMessageDto) {
    const { content, conversationId } = data;

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        userHasConversations: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!conversation?.userHasConversations) {
      throw new CommonException(MessageResponse.CONVERSATION.NOT_FOUND);
    }

    const messageCreated = await this.prisma.message.create({
      data: {
        creatorId: userId,
        conversationId,
        content,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return messageCreated;
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
