import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  EApplicationStatus,
  EJobStatus,
  ERole,
  ESort,
  EUserStatus,
} from 'src/_core/constant/enum.constant';
import { GetListApplicationDto } from './dto/get-list-applications.dto';
import { EOrderPaging } from 'src/_core/type/order-paging.type';
import { UpdateUserProfileDto } from './dto/update-candidate-profile.dto';
import { UserApplyJobDto } from './dto/user-apply-job.dto';
import { UpdateAccountInfoDto } from './dto/update-user-profile';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccountInfo(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    return user;
  }

  async updateAccountInfo(id: number, data: UpdateAccountInfoDto) {
    const { firstName, lastName, avatar } = data;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { firstName, lastName, avatar },
      select: {
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return userUpdated;
  }

  async getUserProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        userRoles: {
          some: {
            role: {
              name: ERole.USER,
            },
          },
        },
      },
      include: {
        city: true,
        candidateInformation: {
          include: {
            desiredJobCategory: true,
            desiredCity: true,
          },
        },
      },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    delete user.password;
    return user;
  }

  async updateUserProfile(id: number, body: UpdateUserProfileDto) {
    const {
      cityId,
      firstName,
      lastName,
      avatar,
      dob,
      gender,
      phoneNumber,
      district,
      maritalStatus,
      address,
      educationalLevel,

      //candidate information
      target,
      desiredJobCategoryId,
      desiredCityId,
      cv,
      yearExperience,
      workExperience,
      education,
      certificate,
      advancedSkill,
      languageSkill,
      desiredSalary,
      desiredJobLevel,
      desiredJobMode,
    } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        userRoles: {
          some: {
            role: {
              name: ERole.USER,
            },
          },
        },
      },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    const userUpdated = await this.prisma.user.update({
      where: {
        id,
        userRoles: {
          some: {
            role: {
              name: ERole.USER,
            },
          },
        },
      },
      data: {
        cityId,
        firstName,
        lastName,
        avatar,
        dob,
        gender,
        phoneNumber,
        district,
        maritalStatus,
        address,
        educationalLevel,
        candidateInformation: {
          update: {
            target,
            desiredJobCategoryId,
            desiredCityId,
            cv,
            yearExperience,
            workExperience,
            education,
            certificate,
            advancedSkill,
            languageSkill,
            desiredSalary,
            desiredJobLevel,
            desiredJobMode,
          },
        },
      },
      include: {
        city: true,
        candidateInformation: {
          include: {
            desiredJobCategory: true,
            desiredCity: true,
          },
        },
      },
    });

    delete userUpdated.password;
    return userUpdated;
  }

  async userApplyJob(userId: number, jobId: number, data: UserApplyJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId, status: EJobStatus.PUBLIC },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const application = await this.prisma.application.findUnique({
      where: {
        userId_jobId: { userId, jobId },
      },
    });

    if (application) {
      throw new CommonException(
        MessageResponse.APPLICATION.ALREADY_APPLICATION,
      );
    }

    try {
      const applicationCreated = await this.prisma.$transaction(async (tx) => {
        const applicationCreated = await tx.application.create({
          data: {
            userId,
            jobId,
            candidateCv: data.candidateCv,
            candidateFirstName: data.candidateFirstName,
            candidateLastName: data.candidateLastName,
            candidatePhoneNumber: data.candidatePhoneNumber,
            candidateEmail: data.candidateEmail,
          },
        });

        await tx.job.update({
          where: {
            id: jobId,
          },
          data: {
            totalCandidate: job.totalCandidate + 1,
          },
        });

        return applicationCreated;
      });

      return applicationCreated;
    } catch (e) {
      throw e;
    }
  }

  async userDeleteApplyJob(userId: number, jobId: number) {
    const application = await this.prisma.application.findUnique({
      where: {
        userId_jobId: { userId, jobId },
        status: {
          not: EApplicationStatus.DELETED,
        },
      },
    });

    if (!application) {
      throw new CommonException(MessageResponse.APPLICATION.NOT_FOUND(jobId));
    }

    await this.prisma.application.update({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      data: {
        status: EApplicationStatus.DELETED,
      },
    });

    return;
  }

  async getListApplications(userId: number, query: GetListApplicationDto) {
    const { status } = query;
    let {
      page,
      limit,
      // skip,
      order,
    } = query;

    page = page ?? 1;
    limit = limit ?? 5;
    order = order ?? EOrderPaging.DESC;

    const listApplications = await this.prisma.application.findMany({
      where: {
        userId,
        status: status ? +status : undefined,
      },
      orderBy: [{ createdAt: ESort.DESC }],
      select: {
        id: true,
        userId: true,
        jobId: true,
        status: true,
        interviewSchedule: true,
        createdAt: true,
        createdBy: true,
        updatedAt: true,
        updatedBy: true,
        candidateCv: true,
        job: {
          select: {
            id: true,
            title: true,
            salaryMin: true,
            salaryMax: true,
            hiringEndDate: true,
            jobHasCities: {
              select: {
                city: true,
              },
            },
            jobHasTags: {
              select: {
                tag: true,
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
        },
      },
    });

    if (listApplications.length === 0) {
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

    const skipItems = (+page - 1) * +limit;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +limit; i++) {
      if (listApplications[i]) {
        const company = listApplications[i].job.creator.company;
        delete listApplications[i].job.creator.company;
        listApplications[i].job['company'] = company;

        const cities = listApplications[i].job.jobHasCities.map((el) => ({
          id: el.city.id,
          name: el.city.name,
        }));
        delete listApplications[i].job.jobHasCities;
        listApplications[i].job['cities'] = cities;

        const tags = listApplications[i].job.jobHasTags.map((el) => ({
          id: el.tag.id,
          name: el.tag.name,
        }));
        delete listApplications[i].job.jobHasTags;
        listApplications[i].job['tags'] = tags;
        listItems.push(listApplications[i]);
      }
    }

    return {
      meta: {
        pagination: {
          page: +page,
          pageSize: +limit,
          totalPage: Math.ceil(listApplications.length / limit),
        },
      },
      data: listItems,
    };
  }
}
