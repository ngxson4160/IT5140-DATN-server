import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  EApplicationStatus,
  EJobStatus,
  EUserStatus,
} from 'src/_core/constant/enum.constant';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    return {
      message: MessageResponse.USER.GET_USER_DETAIL,
      data: {
        id: user.id,
        email: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        dob: user.dob,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        // cv: user.cv,
        // city: user.city,
        // canApplyJob: user.canApplyJob,
        // desiredSalary: user.desiredSalary,
        // yearExperience: user.yearExperience,
      },
    };
  }

  async getDetailUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    return {
      message: MessageResponse.USER.GET_USER_DETAIL,
      data: {
        id: user.id,
        email: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        dob: user.dob,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        // cv: user.cv,
        // city: user.city,
      },
    };
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const {
      firstName,
      lastName,
      avatar,
      dob,
      gender,
      phoneNumber,
      cv,
      city,
      desiredSalary,
      yearExperience,
    } = body;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new CommonException(MessageResponse.USER.NOT_EXIST);
    }

    if (user.status === EUserStatus.INACTIVE) {
      throw new CommonException(MessageResponse.AUTH.ACTIVE_ACCOUNT);
    }

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        avatar,
        dob,
        gender,
        phoneNumber,
        // cv,
        // city,
        // desiredSalary,
        // yearExperience,
        // canApplyJob: true,
      },
    });

    return {
      meta: MessageResponse.USER.UPDATE_SUCCESS,
      data: {
        id: userUpdated.id,
        email: userUpdated.email,
        firstName: userUpdated.firstName,
        lastName: userUpdated.lastName,
        avatar: userUpdated.avatar,
        dob: userUpdated.dob,
        gender: userUpdated.gender,
        phoneNumber: userUpdated.phoneNumber,
      },
    };
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
}
