import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { UpdateJobDto } from './dto/update-job.dto';
import { EJobStatus, ESort } from 'src/_core/constant/enum.constant';
import { GetListJobDto } from './dto/get-list-job.dto';
import { FormatQueryArray } from 'src/_core/helper/utils';
import { FollowJobDto } from './dto/follow-job.dto';
import { GetListFavoriteJobDto } from './dto/get-list-favorite-job';
import { ReopenJobDto } from './dto/reopen-job.dto';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(userId: number, data: CreateJobDto) {
    const {
      jobCategoryId,
      cityIds,
      tagIds,
      title,
      salaryMin,
      salaryMax,
      images,
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
      allowNotification,
      time,
    } = data;

    //TODO validate min < max, start < end

    const jobCreated = await this.prisma.job.create({
      data: {
        creatorId: userId,
        jobCategoryId,
        title,
        salaryMin,
        salaryMax,
        images,
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
        allowNotification,
        time,
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
            version: true,
          },
        },
        ...(userId && {
          userFollowJobs: {
            select: {
              userId: true,
              jobId: true,
            },
          },
        }),
        jobHasCities: {
          select: {
            city: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        jobHasTags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
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
      if (application.userId === userId && application.version === job.version)
        userStatusApplication['status'] = application.status;

      job['application'] = userStatusApplication;
    });
    delete job.applications;

    job['userFollowJob'] = false;
    if (job.userFollowJobs) {
      job.userFollowJobs.forEach((userFollowJob) => {
        if (userFollowJob.userId === userId) job['userFollowJob'] = true;
      });
      delete job.userFollowJobs;
    }

    const cities = job.jobHasCities.map((el) => ({
      id: el.city.id,
      name: el.city.name,
    }));
    delete job.jobHasCities;
    job['cities'] = cities;

    const tags = job.jobHasTags.map((el) => ({
      id: el.tag.id,
      name: el.tag.name,
    }));
    delete job.jobHasTags;
    job['tags'] = tags;

    const creator = await this.prisma.user.findUnique({
      where: { id: job.creatorId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            avatar: true,
            coverImage: true,
            primaryAddress: true,
            sizeType: true,
          },
        },
      },
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
      salaryMin,
      salaryMax,
      images,
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
      allowNotification,
      time,
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
            salaryMin,
            salaryMax,
            images,
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
            allowNotification,
            time,
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

  async reopenJob(userId: number, jobId: number, data: ReopenJobDto) {
    const { hiringStartDate, hiringEndDate } = data;

    const job = await this.prisma.job.findUnique({
      where: { id: jobId, creatorId: userId },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const jobUpdated = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        hiringStartDate,
        hiringEndDate,
        version: ++job.version,
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

    try {
      await this.prisma.$transaction(async (tx) => {
        await this.prisma.application.deleteMany({
          where: {
            jobId,
          },
        });
        await this.prisma.userFollowJob.deleteMany({
          where: {
            jobId,
          },
        });
        await this.prisma.job.delete({
          where: { id: jobId },
        });
      });
    } catch (error: any) {
      throw error;
    }

    return;
  }

  async getListJob(query: GetListJobDto, userId?: number) {
    const {
      cityIds,
      filter,
      jobCategoryIds,
      tagIds,
      jobMode,
      // yearExperienceMin,
      // yearExperienceMax,
      yearExperience,
      level,
      salaryMin,
      salaryMax,
      companyId,
      page,
      limit,
      sortHiringStartDate,
      all,
    } = query;

    let whereSalary: object;

    if (salaryMin && salaryMax) {
      whereSalary = {
        OR: [
          { salaryMin: { gte: salaryMin }, salaryMax: { lte: salaryMax } },
          { salaryMin: 0, salaryMax: { gte: salaryMin, lte: salaryMax } },
          { salaryMin: { gte: salaryMin, lte: salaryMax }, salaryMax: 0 },
        ],
      };
    } else if (!salaryMin && salaryMax) {
      whereSalary = {
        OR: [
          { salaryMax: { lte: salaryMax } },
          { salaryMin: { lte: salaryMax }, salaryMax: 0 },
        ],
      };
    } else if (salaryMin && !salaryMax) {
      whereSalary = {
        OR: [
          { salaryMax: { gte: salaryMin } },
          { salaryMin: { gte: salaryMin } },
        ],
      };
    } else if (salaryMin === 0 && salaryMax === 0) {
      whereSalary = {
        salaryMax: 0,
        salaryMin: 0,
      };
    }

    const whereQuery = {
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
      ...whereSalary,
      // yearExperience: {
      //   gte: yearExperienceMin,
      //   lte: yearExperienceMax,
      // },
      yearExperience: yearExperience,
      jobMode,
      level,
      status: EJobStatus.PUBLIC,
      ...(!all && {
        hiringEndDate: {
          gte: new Date(),
        },
      }),
      ...(companyId && {
        creator: {
          companyId: companyId,
        },
      }),
    };

    const totalApplications = await this.prisma.job.count({
      where: whereQuery,
    });

    const listJob = await this.prisma.job.findMany({
      where: whereQuery,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: sortHiringStartDate || ESort.DESC,
        },
      ],
      include: {
        jobHasCities: {
          select: {
            city: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        jobHasTags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        applications: {
          select: {
            userId: true,
            status: true,
          },
        },
        ...(userId && {
          userFollowJobs: {
            select: {
              userId: true,
              jobId: true,
            },
          },
        }),
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

    for (let i = 0; i < listJob.length; i++) {
      if (listJob[i]) {
        const company = listJob[i].creator.company;
        delete listJob[i].creator.company;
        listJob[i]['company'] = company;

        const cities = listJob[i].jobHasCities.map((el) => ({
          id: el.city.id,
          name: el.city.name,
        }));
        delete listJob[i].jobHasCities;
        listJob[i]['cities'] = cities;

        const tags = listJob[i].jobHasTags.map((el) => ({
          id: el.tag.id,
          name: el.tag.name,
        }));
        delete listJob[i].jobHasTags;
        listJob[i]['tags'] = tags;

        listJob[i]['userFollowJob'] = false;
        if (listJob[i].userFollowJobs) {
          listJob[i].userFollowJobs.forEach((userFollowJob) => {
            if (userFollowJob.userId === userId)
              listJob[i]['userFollowJob'] = true;
          });
        }
        delete listJob[i].userFollowJobs;
      }
    }

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalApplications / limit),
          totalItem: totalApplications,
        },
      },
      data: listJob,
    };
  }

  async followJob(userId: number, jobId: number, data: FollowJobDto) {
    const { isFavorite } = data;

    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const userFollowJob = await this.prisma.userFollowJob.findUnique({
      where: {
        jobId_userId: {
          userId,
          jobId,
        },
      },
    });

    if (isFavorite) {
      if (userFollowJob) {
        throw new CommonException(MessageResponse.USER_FOLLOW_JOB.FOLLOWED);
      }

      await this.prisma.userFollowJob.create({
        data: {
          userId,
          jobId,
        },
      });
    } else {
      if (!userFollowJob) {
        throw new CommonException(MessageResponse.USER_FOLLOW_JOB.NOT_FOUND);
      }

      await this.prisma.userFollowJob.delete({
        where: {
          jobId_userId: {
            userId,
            jobId,
          },
        },
      });
    }
  }

  async getListJobFavorite(userId: number, query: GetListFavoriteJobDto) {
    const { page, limit } = query;

    const totalJobFavorite = await this.prisma.userFollowJob.count({
      where: {
        userId,
      },
    });

    const listJob = await this.prisma.userFollowJob.findMany({
      where: {
        userId,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        job: {
          select: {
            id: true,
            jobCategoryId: true,
            title: true,
            salaryMin: true,
            salaryMax: true,
            images: true,
            jobMode: true,
            level: true,
            officeName: true,
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
        },
      },
      orderBy: [
        {
          createdAt: ESort.DESC,
        },
      ],
    });

    const result = [] as any[];
    for (let i = 0; i < limit; i++) {
      if (listJob[i]) {
        const job = listJob[i].job;
        delete listJob[i].job;
        result.push(job);
      }
    }

    for (let i = 0; i < limit; i++) {
      if (result[i]) {
        const company = result[i].creator.company;
        delete result[i].creator.company;
        result[i]['company'] = company;
        result[i]['userFollowJob'] = true;
      }
    }

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalJobFavorite / limit),
          totalItem: totalJobFavorite,
        },
      },
      data: result,
    };
  }
}
