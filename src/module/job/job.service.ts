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
import { Prisma } from '@prisma/client';
import { CRatingJobScore } from 'src/_core/constant/common.constant';

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

  async getJob(id: number, userId?: number) {
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

    if (userId) {
      const userRatingJob = await this.prisma.userRatingJob.findUnique({
        where: {
          jobId_userId: {
            jobId: id,
            userId,
          },
        },
      });

      if (userRatingJob) {
        const score =
          userRatingJob.score + CRatingJobScore.VIEW_DETAIL >
          CRatingJobScore.APPLY_JOB
            ? CRatingJobScore.APPLY_JOB
            : userRatingJob.score + CRatingJobScore.VIEW_DETAIL;

        await this.prisma.userRatingJob.update({
          where: { id: userRatingJob.id },
          data: {
            score,
          },
        });
      } else {
        await this.prisma.userRatingJob.create({
          data: {
            jobId: id,
            userId,
            score: CRatingJobScore.VIEW_DETAIL,
          },
        });
      }
    }

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
        await tx.application.deleteMany({
          where: {
            jobId,
          },
        });
        await tx.userFollowJob.deleteMany({
          where: {
            jobId,
          },
        });
        await tx.job.delete({
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
      // ...(filter && {
      // OR: [
      //   {
      //     title: {
      //       search: filter,
      //     },
      //   },
      //   {
      //     description: {
      //       search: filter,
      //     },
      //   },
      //   {
      //     requirement: {
      //       search: filter,
      //     },
      //   },
      // ],
      AND: [
        {
          ...(filter && {
            OR: [
              {
                title: {
                  search: filter,
                },
              },
              {
                description: {
                  search: filter,
                },
              },
              {
                requirement: {
                  search: filter,
                },
              },
            ],
          }),
        },
        { ...whereSalary },
      ],
      // }),
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
      // ...whereSalary,
      // yearExperience: {
      //   gte: yearExperienceMin,
      //   lte: yearExperienceMax,
      // },
      yearExperience,
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

    // const results = await this.prisma.$queryRaw
    //   `
    // SELECT j.*, MATCH(title, description, requirement) AGAINST (${filter}) AS relevance_score
    // FROM job j
    // ORDER BY relevance_score DESC
    // LIMIT 15;
    // `;
    // console.log(results)

    let orderBy: object;

    if (filter) {
      orderBy = [
        {
          _relevance: {
            fields: ['title', 'description', 'requirement'],
            search: filter,
            sort: ESort.DESC,
          },
        },
        {
          hiringStartDate: sortHiringStartDate || ESort.DESC,
        },
      ];
    } else {
      orderBy = {
        hiringStartDate: sortHiringStartDate || ESort.DESC,
      };
    }

    const listJob = await this.prisma.job.findMany({
      where: whereQuery,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
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

      const userRatingJob = await this.prisma.userRatingJob.findUnique({
        where: {
          jobId_userId: {
            jobId,
            userId,
          },
        },
      });

      if (userRatingJob) {
        const score =
          userRatingJob.score + CRatingJobScore.FOLLOW_JOB >
          CRatingJobScore.APPLY_JOB
            ? CRatingJobScore.APPLY_JOB
            : userRatingJob.score + CRatingJobScore.FOLLOW_JOB;

        await this.prisma.userRatingJob.update({
          where: { id: userRatingJob.id },
          data: {
            score,
          },
        });
      } else {
        await this.prisma.userRatingJob.create({
          data: {
            jobId,
            userId,
            score: CRatingJobScore.FOLLOW_JOB,
          },
        });
      }
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

  async recommendJob(userId: number) {
    //cosine similarity
    function cosineSimilarity(vecA: number[], vecB: number[]): number {
      // Kiểm tra nếu hai vectơ không cùng kích thước
      if (vecA.length !== vecB.length) {
        throw new Error('Hai vectơ phải cùng kích thước.');
      }

      let dotProduct = 0;
      let magnitudeA = 0;
      let magnitudeB = 0;

      for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
      }

      magnitudeA = Math.sqrt(magnitudeA);
      magnitudeB = Math.sqrt(magnitudeB);

      if (magnitudeA === 0 || magnitudeB === 0) {
        // throw new Error('Vectơ không được có độ lớn bằng 0.');
        return 0;
      }

      return dotProduct / (magnitudeA * magnitudeB);
    }

    //utility matrix
    const buildDataMatrix = (
      ratings: Array<{ userId: number; jobId: number; score: number }>,
      userIdCheck: number,
    ) => {
      const matrix = new Map();
      const listJobRating = [] as number[];

      const users = new Set<number>();
      const jobs = new Set<number>();

      let listUser = [] as number[];
      let listJob = [] as number[];

      const avgRating = new Map();

      ratings.forEach((rating) => {
        const { userId, jobId, score } = rating;
        users.add(userId);
        jobs.add(-jobId);

        const key = `${userId},-${jobId}`;
        matrix.set(key, score);
      });

      const listJobTmp = Array.from(jobs);
      listJobTmp.sort((a, b) => b - a);
      listJob = listJobTmp;

      const listUserTmp = Array.from(users);
      listUserTmp.sort((a, b) => a - b);
      listUser = listUserTmp;

      users.forEach((user) => {
        let sum = 0;
        let count = 0;
        const listEmpty = [] as number[];

        jobs.forEach((job) => {
          const key = `${user},${job}`;

          if (isNaN(Number(matrix.get(key)))) {
            matrix.set(key, 0);
            listEmpty.push(job);

            if (user === userIdCheck) {
              listJobRating.push(-job);
            }
          } else {
            count++;
            sum += matrix.get(key);
          }
        });

        avgRating.set(user, sum / count);

        jobs.forEach((job) => {
          const key = `${user},${job}`;

          if (!listEmpty.includes(job)) {
            matrix.set(key, matrix.get(key) - sum / count);
          }
        });
      });

      return { matrix, listJobRating, listUser, listJob, avgRating };
    };

    //matrix similar user
    const matrixSimilarUser = (
      userIds: number[],
      jobIds: number[],
      utilityMatrix: Map<string, number>,
    ) => {
      const matrixSimilar = new Map<string, number>();

      for (let i = 0; i < userIds.length - 1; i++) {
        const vector1 = [] as any;

        jobIds.forEach((job) => {
          const key = `${userIds[i]},${job}`;
          vector1.push(utilityMatrix.get(key));
        });

        for (let j = i + 1; j < userIds.length; j++) {
          const vector2 = [] as any;

          jobIds.forEach((job) => {
            const key = `${userIds[j]},${job}`;
            vector2.push(utilityMatrix.get(key));
          });

          matrixSimilar.set(
            `${userIds[i]},${userIds[j]}`,
            cosineSimilarity(vector1, vector2),
          );
          matrixSimilar.set(
            `${userIds[j]},${userIds[i]}`,
            cosineSimilarity(vector1, vector2),
          );
        }
      }

      return matrixSimilar;
    };

    //predict rating
    const predictRating = (
      k: number,
      userId: number,
      ratings: { userId: number; jobId: number; score: number }[],
    ) => {
      const {
        matrix: matrixUtility,
        listJobRating,
        listUser,
        listJob,
        avgRating,
      } = buildDataMatrix(ratings, userId);

      const matrixSimilar: Map<string, any> = matrixSimilarUser(
        listUser,
        listJob,
        matrixUtility,
      );

      const predict = [] as any[];

      listJobRating.forEach((jobId) => {
        const userIdRatings = ratings
          .filter((el) => el.jobId === jobId)
          .map((el) => el.userId);

        const similarScore = new Map<string, any>();

        userIdRatings.forEach((userIdRating) => {
          similarScore.set(
            `${userId},${userIdRating}`,
            matrixSimilar.get(`${userId},${userIdRating}`),
          );
        });

        let entries = Array.from(similarScore.entries());
        if (userIdRatings.length > k) {
          entries.sort((a, b) => b[1] - a[1]);
          entries = entries.slice(0, k);
        }

        const maxItem = userIdRatings.length > k ? k : userIdRatings.length;
        let t = 0,
          m = 0;
        for (let i = 0; i < maxItem; i++) {
          t +=
            matrixSimilar.get(entries[i][0]) *
            matrixUtility.get(`${entries[i][0].split(',')[1]},${-jobId}`);
          m += Math.abs(matrixSimilar.get(entries[i][0]));
        }

        if (m === 0) {
          predict.push([jobId, avgRating.get(userId)]);
        } else {
          predict.push([jobId, t / m + avgRating.get(userId)]);
        }
      });

      predict.sort((a, b) => b[1] - a[1]);
      return predict;
    };

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        candidateInformation: {
          select: {
            desiredJobCategoryId: true,
          },
        },
      },
    });

    const userRatingJob = await this.prisma.userRatingJob.findMany({
      where: {
        userId,
      },
      // take: 5,
      orderBy: [{ createdAt: ESort.DESC }, { score: ESort.DESC }],
      select: {
        userId: true,
        jobId: true,
        score: true,
      },
    });

    // console.log('userRatingJob', userRatingJob);

    const userSimilar = await this.prisma.userRatingJob.findMany({
      where: {
        jobId: {
          in: userRatingJob.map((el) => el.jobId),
        },
        userId: {
          not: userId,
        },
        // user: {
        //   candidateInformation: {
        //     desiredJobCategoryId:
        //       user.candidateInformation.desiredJobCategoryId,
        //   },
        // },
      },
      // take: 10,
      orderBy: [{ createdAt: ESort.DESC }, { score: ESort.DESC }],
      select: {
        userId: true,
        jobId: true,
        score: true,
      },
    });

    const jobNotRating = await this.prisma.userRatingJob.findMany({
      where: {
        userId: {
          in: userSimilar.map((el) => el.userId),
        },
        jobId: {
          notIn: userRatingJob.map((el) => el.jobId),
        },
        // user: {
        //   candidateInformation: {
        //     desiredJobCategoryId:
        //       user.candidateInformation.desiredJobCategoryId,
        //   },
        // },
      },
      // take: 30,
      orderBy: [{ createdAt: ESort.DESC }, { score: ESort.DESC }],
      select: {
        userId: true,
        jobId: true,
        score: true,
      },
    });

    const input = [...userRatingJob, ...userSimilar, ...jobNotRating];
    // console.log('input', input);

    const predict = predictRating(2, userId, input);

    return predict;
  }
}
