import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EUserStatus } from 'src/_core/constant/enum.constant';

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
}
