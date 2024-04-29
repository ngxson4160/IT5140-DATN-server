import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  EApplicationStatus,
  EJobStatus,
  ERole,
  EUserStatus,
} from 'src/_core/constant/enum.constant';
import { GetListApplicationDto } from './dto/get-list-applications.dto';
import { EOrderPaging } from 'src/_core/type/order-paging.type';
import { UpdateUserProfileDto } from './dto/update-candidate-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
    delete user.cityId;
    delete user.candidateInformation.desiredCityId;
    delete user.candidateInformation.desiredJobCategoryId;
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

      //candidate information
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
      desiredMode,
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
        candidateInformation: {
          update: {
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
            desiredMode,
          },
        },
      },
      include: {
        city: true,
        candidateInformation: {
          include: {
            desiredCity: true,
          },
        },
      },
    });

    delete userUpdated.password;
    delete userUpdated.cityId;
    delete userUpdated.candidateInformation.desiredCityId;
    return userUpdated;
  }

  async userApplyJob(userId: number, jobId: number) {
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

    const applicationCreated = await this.prisma.application.create({
      data: {
        userId,
        jobId,
      },
    });

    return applicationCreated;
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
        listItems.push(listApplications[i]);
      }
    }

    return {
      page: +page,
      pageSize: +limit,
      totalPage: Math.ceil(listApplications.length / limit),
      listApplications: listItems,
    };
  }
}
