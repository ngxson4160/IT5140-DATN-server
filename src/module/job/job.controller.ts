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

  @PublicOrAuth()
  @Get(':id')
  getJob(@Param('id') id: string, @UserData() userData: IUserData) {
    return this.jobService.getJob(+id, userData?.id);
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
}
