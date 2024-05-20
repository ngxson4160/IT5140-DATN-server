import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { GetListApplicationDto } from './dto/get-list-applications.dto';
import { UpdateUserProfileDto } from './dto/update-candidate-profile.dto';
import { UserApplyJobDto } from './dto/user-apply-job.dto';
import { UpdateAccountInfoDto } from './dto/update-user-profile';
import { JobService } from '../job/job.service';
import { GetListFavoriteJobDto } from '../job/dto/get-list-favorite-job';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,
  ) {}

  @Get('account-info')
  async getAccountInfo(@UserData() userData: IUserData) {
    return this.userService.getAccountInfo(userData.id);
  }

  @Put('account-info')
  async updateAccountInfo(
    @UserData() userData: IUserData,
    @Body() body: UpdateAccountInfoDto,
  ) {
    return this.userService.updateAccountInfo(userData.id, body);
  }

  @Get('my-profile')
  async getMyProfile(@UserData() userData: IUserData) {
    return this.userService.getUserProfile(userData.id);
  }

  @Put('my-profile')
  async updateMyProfile(
    @UserData() userData: IUserData,
    @Body() body: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(userData.id, body);
  }

  @Post('jobs/:id/applications')
  userApplyJob(
    @UserData() userData: IUserData,
    @Param('id') jobId: string,
    @Body() body: UserApplyJobDto,
  ) {
    return this.userService.userApplyJob(userData.id, +jobId, body);
  }

  @Delete('jobs/:id/applications')
  userDeleteApplyJob(
    @UserData() userData: IUserData,
    @Param('id') jobId: string,
  ) {
    return this.userService.userDeleteApplyJob(userData.id, +jobId);
  }

  @Get('applications')
  async getListApplications(
    @UserData() userData: IUserData,
    @Query() query: GetListApplicationDto,
  ) {
    return this.userService.getListApplications(userData.id, query);
  }

  @Get('jobs/favorites')
  userListFavorite(
    @UserData() userData: IUserData,
    @Query() query: GetListFavoriteJobDto,
  ) {
    return this.jobService.getListJobFavorite(userData.id, query);
  }
}
