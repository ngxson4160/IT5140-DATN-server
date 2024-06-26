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
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { Public } from 'src/auth/decorator/public.decorator';
import { UpdateJobDto } from './dto/update-job.dto';
import { GetListJobDto } from './dto/get-list-job.dto';
import { PublicOrAuth } from 'src/_core/decorator/public-or-auth.decorator';
import { FollowJobDto } from './dto/follow-job.dto';
import { ReopenJobDto } from './dto/reopen-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  createJob(@UserData() userData: IUserData, @Body() body: CreateJobDto) {
    return this.jobService.createJob(userData.id, body);
  }

  @PublicOrAuth()
  @Get()
  getListJob(@Query() query: GetListJobDto, @UserData() userData: IUserData) {
    return this.jobService.getListJob(query, userData?.id);
  }

  @Get('recommend')
  recommendJob(@UserData() userData: IUserData) {
    return this.jobService.recommendJob(userData.id);
  }

  @PublicOrAuth()
  @Get(':id')
  getJob(@Param('id') id: string, @UserData() userData: IUserData) {
    return this.jobService.getJob(+id, userData?.id);
  }

  @Put(':id/reopen')
  reopenJob(
    @UserData() userData: IUserData,
    @Param('id') jobId: string,
    @Body() body: ReopenJobDto,
  ) {
    return this.jobService.reopenJob(userData.id, +jobId, body);
  }

  @Put(':id')
  updateJob(
    @UserData() userData: IUserData,
    @Param('id') jobId: string,
    @Body() body: UpdateJobDto,
  ) {
    return this.jobService.updateJob(userData.id, +jobId, body);
  }

  @Delete(':id')
  deleteJob(@UserData() userData: IUserData, @Param('id') jobId: string) {
    return this.jobService.deleteJob(userData.id, +jobId);
  }

  @Post(':id/favorites')
  followJob(
    @UserData() userData: IUserData,
    @Param('id') jobId: string,
    @Body() body: FollowJobDto,
  ) {
    return this.jobService.followJob(userData.id, +jobId, body);
  }
}
