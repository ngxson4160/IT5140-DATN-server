import { NotificationService } from './notification.service';
import { Socket } from 'socket.io';
import { GetListApplicationDto } from '../user/dto/get-list-applications.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ENotificationStatus } from 'src/_core/constant/enum.constant';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.headers['userid'];
    client.join(userId);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.headers['userid'] as string;
    client.leave(userId);
  }

  @SubscribeMessage('findAllNotification')
  findAllNotification(
    @MessageBody() getListNotificationDto: GetListApplicationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.headers['userid'];

    return this.notificationService.findManyNotification(
      +userId,
      getListNotificationDto,
    );
  }

  @SubscribeMessage('countNotificationUnread')
  countNotificationUnread(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.headers['userid'];

    const count = this.notificationService.countNotificationUnread(+userId);

    return count;
  }

  @SubscribeMessage('updateReadNotification')
  updateReadNotification(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.headers['userid'];

    const count = this.notificationService.updateManyNotification(+userId, {
      status: ENotificationStatus.READ,
    });

    return count;
  }

  async createNotification(createNotification: CreateNotificationDto) {
    const content = await this.notificationService.createNotification(
      createNotification,
    );

    const userSend = await this.prisma.user.findUnique({
      where: {
        id: createNotification.fromUserId,
      },
      select: {
        avatar: true,
        company: {
          select: {
            avatar: true,
          },
        },
      },
    });

    if (userSend?.company) {
      userSend.avatar = userSend?.company.avatar;
    }
    delete userSend.company;

    const countNotificationUnread =
      await this.notificationService.countNotificationUnread(
        createNotification.toUserId,
      );

    this.server
      .to(createNotification.toUserId.toString())
      .emit('createNotification', {
        notificationCreated: { ...content, userSend },
        countNotificationUnread,
      });

    return content;
  }
}
