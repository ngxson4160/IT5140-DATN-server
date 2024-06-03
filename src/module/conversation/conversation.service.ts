import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import {
  EConversationType,
  ESort,
  EUserHasConversationStatus,
} from 'src/_core/constant/enum.constant';
import { GetMessageConversation } from './dto/get-message-conversation.dto';
import { GetListConversation } from './dto/get-list-conversation.dto';
import { ReadMessageDto } from '../message/dto/read-message.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversationPair(
    userCreateId: number,
    data: CreateConversationDto,
  ) {
    const { withUserId } = data;

    const user = await this.prisma.user.findUnique({
      where: {
        id: withUserId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      throw new CommonException(MessageResponse.USER.NOT_FOUND(withUserId));
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { userHasConversations: { some: { userId: userCreateId } } },
          { userHasConversations: { some: { userId: withUserId } } },
        ],
      },
    });

    if (conversation) {
      return {
        ...conversation,
        users: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          company: user.company,
        },
      };
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
              status: EUserHasConversationStatus.READ_MESSAGE,
            },
            {
              userId: withUserId,
              conversationId: conversationCreated.id,
              status: EUserHasConversationStatus.READ_MESSAGE,
            },
          ],
        });
        return {
          ...conversationCreated,
          users: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            company: user.company,
          },
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
      take: limit,
      // skip: (page - 1) * limit,
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

    const userHasConversation = await this.prisma.userHasConversation.findMany({
      where: {
        conversationId,
      },
    });

    return { ...conversation, users: userHasConversation };
  }

  async getListConversation(userId: number, data: GetListConversation) {
    const { page, limit, cursor } = data;

    const countListConversation = await this.prisma.conversation.count({
      where: {
        userHasConversations: {
          some: {
            userId,
          },
        },
        messages: {
          some: {
            id: {
              gt: 0,
            },
          },
        },
      },
    });

    let message = await this.prisma.message.findMany({
      distinct: 'conversationId',
      where: {
        id: {
          lt: cursor,
        },
        conversation: {
          userHasConversations: {
            some: {
              userId,
            },
          },
        },
      },
      take: limit,
      orderBy: {
        id: ESort.DESC,
      },
      include: {
        conversation: {
          select: {
            id: true,
            userHasConversations: {
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
                status: true,
              },
            },
          },
        },
      },
    });

    message = message.map((mess) => {
      mess.conversation.userHasConversations.forEach((el) => {
        if (el.user.id === userId) {
          mess.conversation['status'] = el.status;
        } else {
          mess.conversation['users'] = el.user;
        }
      });

      delete mess.conversation.userHasConversations;

      return mess;
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
      data: message,
    };
  }

  async readConversation(userId: number, data: ReadMessageDto) {
    await this.prisma.userHasConversation.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId: data.conversationId,
        },
      },
      data: {
        status: EUserHasConversationStatus.READ_MESSAGE,
      },
    });
  }

  async countConversationUnread(userId: number) {
    const countConversation = await this.prisma.userHasConversation.count({
      where: { userId, status: EUserHasConversationStatus.UNREAD_MESSAGE },
    });

    return countConversation;
  }
}
