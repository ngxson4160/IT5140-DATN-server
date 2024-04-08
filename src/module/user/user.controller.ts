import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(@UserData() userData: IUserData) {
    return this.userService.getUserProfile(userData.id);
  }

  @Post('jobs/:id/applications')
  userApplyJob(@UserData() userData: IUserData, @Param('id') jobId: string) {
    return this.userService.userApplyJob(userData.id, +jobId);
  }

  @Delete('jobs/:id/applications')
  userDeleteApplyJob(
    @UserData() userData: IUserData,
    @Param('id') jobId: string,
  ) {
    return this.userService.userDeleteApplyJob(userData.id, +jobId);
  }

  @Get(':id')
  async getDetailUser(@Param('id') id: string) {
    return this.userService.getDetailUser(+id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(+id, body);
  }
}
