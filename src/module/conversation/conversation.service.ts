import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { EConversationType, ESort } from 'src/_core/constant/enum.constant';
import { GetMessageConversation } from './dto/get-message-conversation.dto';
import { GetListConversation } from './dto/get-list-conversation.dto';

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

  async getMessageConversation(
    userId: number,
    conversationId: number,
    data: GetMessageConversation,
  ) {
    const { page, limit, cursor } = data;

    let users = await this.prisma.user.findMany({
      where: {
        userHasConversations: {
          some: {
            conversationId,
          },
        },
      },
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
    });

    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userHasConversations: {
          some: {
            userId,
          },
        },
      },
    });

    if (!conversation) {
      throw new CommonException(MessageResponse.CONVERSATION.NOT_FOUND);
    }

    const totalMessage = await this.prisma.message.count({
      where: {
        conversationId,
      },
    });

    let listMessage = await this.prisma.message.findMany({
      where: {
        conversationId,
        id: {
          lt: cursor,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: ESort.DESC },
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
      },
    });

    users = users.filter((el) => el.id !== userId);
    listMessage = listMessage.map((el) => {
      if (el.creatorId === userId) {
        el['yourMessage'] = true;
      } else {
        el['yourMessage'] = false;
      }
      return el;
    });

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalMessage / limit),
          totalItem: totalMessage,
        },
      },
      data: {
        conversation: {
          ...conversation,
          users,
        },
        message: listMessage.reverse(),
      },
    };
  }

  async getConversationDetail(userId: number, conversationId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userHasConversations: {
          some: { userId },
        },
      },
      include: {
        messages: {
          take: 2,
        },
      },
    });

    if (!conversation) {
      throw new CommonException(MessageResponse.CONVERSATION.NOT_FOUND);
    }

    return conversation;
  }

  async getListConversation(userId: number, data: GetListConversation) {
    const { page, limit, cursor } = data;

    const countListConversation = await this.prisma.conversation.count({
      where: {
        id: {
          lt: cursor,
        },
        userHasConversations: {
          some: {
            userId,
          },
        },
      },
    });

    const listConversation = await this.prisma.conversation.findMany({
      where: {
        id: {
          lt: cursor,
        },
        userHasConversations: {
          some: {
            userId,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: ESort.DESC,
      },
      include: {
        messages: {
          orderBy: {
            id: ESort.DESC,
          },
          take: 1,
        },
      },
    });

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(countListConversation / limit),
          totalItem: countListConversation,
        },
      },
      data: listConversation,
    };
  }
}
