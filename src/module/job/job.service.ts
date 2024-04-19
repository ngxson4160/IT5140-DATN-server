import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { UpdateJobDto } from './dto/update-job.dto';
import {
  EApplicationStatus,
  EJobStatus,
} from 'src/_core/constant/enum.constant';
import { GetListJobDto } from './dto/get-list-job.dto';
import { EOrderPaging } from 'src/_core/type/order-paging.type';

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
      tagIds,
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
        ...(tagIds &&
          tagIds.length > 0 && {
            jobHasTags: {
              createMany: {
                data: tagIds?.map((tagId) => ({ tagId: tagId })),
              },
            },
          }),
      },
      include: {
        jobHasTags: true,
      },
    });

    return jobCreated;
  }

  async getJob(id: number, userId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id, status: EJobStatus.PUBLIC },
      include: {
        applications: {
          select: {
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(id));
    }

    const userStatusApplication: object | null = { status: null };
    job['application'] = userStatusApplication;
    job.applications.forEach((application) => {
      if (application.userId === userId)
        userStatusApplication['status'] = application.status;

      job['application'] = userStatusApplication;
    });
    delete job.applications;

    const creator = await this.prisma.user.findUnique({
      where: { id: job.creatorId },
      include: { company: true },
    });

    await this.prisma.job.update({
      where: { id },
      data: { totalViews: ++job.totalViews },
    });

    return { job, company: creator.company };
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

  //TODO filter tag name
  async getListJob(query: GetListJobDto, userId?: number) {
    const {
      cities,
      filter,
      jobCategoryIds,
      tagIds,
      salary,
      workExperience,
      workMode,
      position,
    } = query;

    let {
      page,
      take,
      // skip,
      order,
    } = query;

    page = page ?? 1;
    take = take ?? 5;
    order = order ?? EOrderPaging.DESC;

    const listJob = await this.prisma.job.findMany({
      where: {
        ...(filter && {
          OR: [
            { title: { contains: filter } },
            { description: { contains: filter } },
            { benefits: { contains: filter } },
          ],
        }),
        jobCategory: {
          id: {
            in: jobCategoryIds
              ? JSON.parse(jobCategoryIds?.toString())
              : undefined,
          },
        },
        ...(tagIds && {
          jobHasTags: {
            some: {
              tagId: {
                in: tagIds ? JSON.parse(tagIds?.toString()) : undefined,
              },
            },
          },
        }),
        ...(salary && {
          salaryMax: {
            gte: +salary,
          },
          salaryMin: {
            lte: +salary,
          },
        }),
        workMode: {
          in: workMode ? JSON.parse(workMode?.toString()) : undefined,
        },
        // city: {
        //   array_contains: cities,
        // },
        ...(workExperience && {
          yearExperienceMin: {
            lte: +workExperience,
          },
          yearExperienceMax: {
            gte: +workExperience,
          },
        }),
        status: EJobStatus.PUBLIC,
        position,
        hiringEndDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: order,
      },
      include: {
        applications: {
          select: {
            userId: true,
            status: true,
          },
        },
      },
    });

    if (listJob.length === 0) {
      return {
        page: +page,
        pageSize: +take,
        totalPage: 0,
        listJob: [],
      };
    }

    let jobFilterCities = [];

    listJob.forEach((job) => {
      const userStatusApplication: object | null = { status: null };
      job['application'] = userStatusApplication;
      job.applications.forEach((application) => {
        if (application.userId === userId)
          userStatusApplication['status'] = application.status;

        job['application'] = userStatusApplication;
      });
      delete job.applications;
    });

    if (cities) {
      listJob.forEach((job) => {
        const jobCity = job.city as Array<string>;
        const isMatchFilterCities = jobCity.some((el) => cities.includes(el));
        if (isMatchFilterCities) {
          jobFilterCities.push(job);
        }
      });
    } else {
      jobFilterCities = listJob;
    }

    const skipItems = (+page - 1) * +take;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +take; i++) {
      if (jobFilterCities[i]) {
        listItems.push(jobFilterCities[i]);
      }
    }

    return {
      page: +page,
      pageSize: +take,
      totalPage: Math.ceil(jobFilterCities.length / take),
      listJob: listItems,
    };
  }
}
