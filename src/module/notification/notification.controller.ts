import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetListNotificationDto } from './dto/get-list-notification.dto';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { UpdateManyNotificationDto } from './dto/update-many-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getListNotification(
    @UserData() userData: IUserData,
    @Query() data: GetListNotificationDto,
  ) {
    return this.notificationService.findManyNotification(userData.id, data);
  }

  @Put()
  updateManyNotification(
    @UserData() userData: IUserData,
    @Body() data: UpdateManyNotificationDto,
  ) {
    return this.notificationService.updateManyNotification(userData.id, data);
  }
}
