import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import {
  EConversationStatus,
  EUserHasConversationStatus,
} from 'src/_core/constant/enum.constant';

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
            company: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        conversation: {
          select: {
            id: true,
          },
        },
      },
    });

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.userHasConversation.updateMany({
          where: {
            conversationId,
          },
          data: {
            status: EUserHasConversationStatus.UNREAD_MESSAGE,
          },
        });

        await tx.userHasConversation.update({
          where: {
            userId_conversationId: {
              userId,
              conversationId,
            },
          },
          data: {
            status: EUserHasConversationStatus.READ_MESSAGE,
          },
        });

        await tx.conversation.update({
          where: {
            id: conversation.id,
          },
          data: {
            status: EConversationStatus.ACTIVE,
          },
        });
      });
    } catch (error) {
      throw error;
    }

    const userReceive = await this.prisma.userHasConversation.findFirst({
      where: {
        conversationId,
        userId: {
          not: userId,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            company: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const messageFormat = {
      ...messageCreated,
      conversation: {
        ...messageCreated.conversation,
        status: EUserHasConversationStatus.UNREAD_MESSAGE,
        users: messageCreated.creator,
      },
      userReceive: userReceive.user,
    };

    return messageFormat;
  }
}
