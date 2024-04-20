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
import { FormatQueryArray } from 'src/_core/helper/utils';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(userId: number, data: CreateJobDto) {
    const {
      jobCategoryId,
      cityIds,
      tagIds,
      title,
      position,
      salaryMin,
      salaryMax,
      images,
      hours,
      jobMode,
      level,
      officeName,
      address,
      quantity,
      status,
      benefits,
      description,
      requirement,
      gender,
      yearExperience,
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
        jobMode,
        level,
        officeName,
        address,
        quantity,
        status,
        benefits,
        description,
        requirement,
        gender,
        yearExperience,
        hiringStartDate,
        hiringEndDate,
        ...(cityIds &&
          cityIds.length > 0 && {
            jobHasCities: {
              createMany: {
                data: cityIds?.map((cityId) => ({ cityId: cityId })),
              },
            },
          }),
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
      cityIds,
      tagIds,
      title,
      position,
      salaryMin,
      salaryMax,
      images,
      hours,
      jobMode,
      level,
      officeName,
      address,
      quantity,
      status,
      benefits,
      description,
      requirement,
      gender,
      yearExperience,
      hiringStartDate,
      hiringEndDate,
    } = data;

    const job = await this.prisma.job.findUnique({
      where: { id: jobId, creatorId: userId },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    try {
      const jobUpdated = await this.prisma.$transaction(async (tx) => {
        await tx.jobHasTag.deleteMany({ where: { jobId } });
        await tx.jobHasCity.deleteMany({ where: { jobId } });

        const jobUpdated = await tx.job.update({
          where: { id: jobId },
          data: {
            jobCategoryId,
            title,
            position,
            salaryMin,
            salaryMax,
            images,
            hours,
            jobMode,
            level,
            officeName,
            address,
            quantity,
            status,
            benefits,
            description,
            requirement,
            gender,
            yearExperience,
            hiringStartDate,
            hiringEndDate,
            ...(cityIds &&
              cityIds.length > 0 && {
                jobHasCities: {
                  createMany: {
                    data: cityIds?.map((cityId) => ({ cityId: cityId })),
                  },
                },
              }),
            ...(tagIds &&
              tagIds.length > 0 && {
                jobHasTags: {
                  createMany: {
                    data: tagIds?.map((tagId) => ({ tagId: tagId })),
                  },
                },
              }),
          },
        });

        return jobUpdated;
      });

      return jobUpdated;
    } catch (e) {
      throw e;
    }
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

  async getListJob(query: GetListJobDto, userId?: number) {
    const {
      cityIds,
      filter,
      jobCategoryIds,
      tagIds,
      jobMode,
      yearExperienceMin,
      yearExperienceMax,
      level,
      salaryMin,
      salaryMax,
    } = query;

    let { page, limit, order } = query;

    page = page ?? 1;
    limit = limit ?? 5;
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
            in: jobCategoryIds ? FormatQueryArray(jobCategoryIds) : undefined,
          },
        },
        ...(cityIds && {
          jobHasCities: {
            some: {
              cityId: {
                // in: cityIds ? JSON.parse(cityIds?.toString()) : undefined,
                in: cityIds ? FormatQueryArray(cityIds) : undefined,
              },
            },
          },
        }),
        ...(tagIds && {
          jobHasTags: {
            some: {
              tagId: {
                in: tagIds ? FormatQueryArray(tagIds) : undefined,
              },
            },
          },
        }),
        ...(salaryMax && {
          salaryMax: {
            lte: +salaryMax,
          },
        }),
        ...(salaryMin && {
          salaryMin: {
            gte: +salaryMin,
          },
        }),
        yearExperience: {
          gte: yearExperienceMin ? +yearExperienceMin : undefined,
          lte: yearExperienceMax ? +yearExperienceMax : undefined,
        },
        jobMode,
        level,
        status: EJobStatus.PUBLIC,
        hiringEndDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: order,
      },
      include: {
        jobHasCities: {
          select: {
            cityId: true,
          },
        },
        applications: {
          select: {
            userId: true,
            status: true,
          },
        },
        creator: {
          select: {
            company: {
              select: {
                id: true,
                name: true,
                avatar: true,
                coverImage: true,
              },
            },
          },
        },
      },
    });

    if (listJob.length === 0) {
      return {
        meta: {
          pagination: {
            page: +page,
            pageSize: +limit,
            totalPage: 0,
          },
        },
        data: [],
      };
    }

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

    const skipItems = (+page - 1) * +limit;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +limit; i++) {
      if (listJob[i]) {
        const company = listJob[i].creator.company;
        delete listJob[i].creator.company;
        listJob[i]['company'] = company;

        const cityIds = listJob[i].jobHasCities.map((el) => el.cityId);
        delete listJob[i].jobHasCities;
        listJob[i]['cityIds'] = cityIds;

        listItems.push(listJob[i]);
      }
    }

    return {
      meta: {
        pagination: {
          page: +page,
          pageSize: +limit,
          totalPage: Math.ceil(listJob.length / limit),
        },
      },
      data: listItems,
      // listJob: listItems,
    };
  }
}
