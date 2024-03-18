import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { BaseException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/_core/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser() {
    // const userExist = await this.prisma.user.findUnique({ where: { id } });
    const userCreated = await this.prisma.user.create({
      data: {
        email: 'test' + new Date(),
      },
    });

    // const userUpdated = await this.prisma.user.update({
    //   where: {
    //     id: 1,
    //   },
    //   data: {
    //     email: 'test' + new Date(),
    //   },
    // });

    // throw new BaseException(MessageResponse.USER.NOT_FOUND(1))

    return {
      meta: MessageResponse.USER.CREATE_SUCCESS,
      data: userCreated,
    };
  }
}
