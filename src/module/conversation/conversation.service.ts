import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { EConversationType } from 'src/_core/constant/enum.constant';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversationPair(
    userCreateId: number,
    data: CreateConversationDto,
  ) {
    const { withUserId } = data;

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        userHasConversations: {
          // Why using 'every' instead 'some' is wrong.
          some: {
            userId: {
              in: [userCreateId, withUserId],
            },
          },
        },
      },
      include: {
        userHasConversations: {
          select: {
            id: true,
          },
        },
      },
    });

    if (conversation?.userHasConversations?.length === 2) {
      throw new CommonException(MessageResponse.CONVERSATION.EXIST);
    }

    try {
      const response = await this.prisma.$transaction(async (tx) => {
        const conversationCreated = await tx.conversation.create({
          data: { type: EConversationType.PAIR },
        });
        await tx.userHasConversation.createMany({
          data: [
            {
              userId: userCreateId,
              conversationId: conversationCreated.id,
            },
            {
              userId: withUserId,
              conversationId: conversationCreated.id,
            },
          ],
        });
        return {
          userCreateId,
          withUserId,
          conversationId: conversationCreated.id,
        };
      });
      return response;
    } catch (e) {
      throw e;
    }
  }
}
