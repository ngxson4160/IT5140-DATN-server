import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { UpdateJobDto } from './dto/update-job.dto';
import { EJobStatus } from 'src/_core/constant/enum.constant';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(userId: number, data: CreateJobDto) {
    const {
      jobCategoryId,
      title,
      position,
      salaryMin,
      salaryMax,
      images,
      hours,
      workMode,
      officeName,
      city,
      address,
      quantity,
      status,
      benefits,
      description,
      requirement,
      gender,
      yearExperienceMin,
      yearExperienceMax,
      hiringStartDate,
      hiringEndDate,
    } = data;

    //TODO validate min < max, start < end

    const jobCreated = await this.prisma.job.create({
      data: {
        creatorId: userId,
        jobCategoryId,
        title,
        position,
        salaryMin,
        salaryMax,
        images,
        hours,
        workMode,
        officeName,
        city,
        address,
        quantity,
        status,
        benefits,
        description,
        requirement,
        gender,
        yearExperienceMin,
        yearExperienceMax,
        hiringStartDate,
        hiringEndDate,
      },
    });

    return jobCreated;
  }

  async getJob(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id, status: EJobStatus.PUBLIC },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(id));
    }

    const creator = await this.prisma.user.findUnique({
      where: { id: job.creatorId },
      include: { company: true },
    });

    await this.prisma.job.update({
      where: { id },
      data: { totalViews: ++job.totalViews },
    });

    return { company: creator.company, job };
  }

  async updateJob(userId: number, jobId: number, data: UpdateJobDto) {
    const {
      jobCategoryId,
      title,
      position,
      salaryMin,
      salaryMax,
      images,
      hours,
      workMode,
      officeName,
      city,
      address,
      quantity,
      status,
      benefits,
      description,
      requirement,
      gender,
      yearExperienceMin,
      yearExperienceMax,
      hiringStartDate,
      hiringEndDate,
    } = data;

    const job = await this.prisma.job.findUnique({
      where: { id: jobId, creatorId: userId },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const jobUpdated = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        jobCategoryId,
        title,
        position,
        salaryMin,
        salaryMax,
        images,
        hours,
        workMode,
        officeName,
        city,
        address,
        quantity,
        status,
        benefits,
        description,
        requirement,
        gender,
        yearExperienceMin,
        yearExperienceMax,
        hiringStartDate,
        hiringEndDate,
      },
    });

    return jobUpdated;
  }

  async deleteJob(userId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId, creatorId: userId },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const jobDeleted = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: EJobStatus.DELETED,
      },
    });

    //TODO update user apply this job to  FAILURE??? ---> or delete user apply this job?

    return;
  }
}
