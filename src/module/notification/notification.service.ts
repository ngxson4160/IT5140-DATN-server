import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ENotificationStatus, ESort } from 'src/_core/constant/enum.constant';
import { GetListNotificationDto } from './dto/get-list-notification.dto';
import { Prisma } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateManyNotificationDto } from './dto/update-many-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findManyNotification(toUserId: number, params: GetListNotificationDto) {
    const { page, limit, sortCreatedAt } = params;

    const totalNotification = await this.prisma.notification.count({
      where: { toUserId: toUserId },
    });

    const listNotification = await this.prisma.notification.findMany({
      where: { toUserId: toUserId },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [
        {
          createdAt: sortCreatedAt || ESort.DESC,
        },
      ],
      include: {
        fromUser: {
          select: {
            id: true,
            avatar: true,
            company: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    for (let i = 0; i < listNotification.length; i++) {
      const fromUser = listNotification[i].fromUser;
      listNotification[i]['userSend'] = {
        id: fromUser.id,
        avatar: fromUser.company?.avatar || fromUser.avatar,
      };
      delete listNotification[i].fromUser;
    }

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalNotification / limit),
          totalItem: totalNotification,
        },
      },
      data: listNotification,
    };
  }

  async countNotificationUnread(userId: number) {
    return this.prisma.notification.count({
      where: { toUserId: userId, status: ENotificationStatus.UNREAD },
    });
  }

  async createNotification(data: CreateNotificationDto) {
    const { fromUserId, toUserId, content } = data;
    return await this.prisma.notification.create({
      data: { fromUserId, toUserId, content },
    });
  }

  async updateManyNotification(
    toUserId: number,
    data: UpdateManyNotificationDto,
  ) {
    const { content, status } = data;
    return await this.prisma.notification.updateMany({
      where: {
        toUserId,
      },
      data: { content, status },
    });
  }
}
