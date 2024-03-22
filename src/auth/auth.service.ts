import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { ERole, EUserStatus } from 'src/_core/constant/enum.constant';
import { SignUpDto } from './dto/sign-up.dto';
import { ENV } from 'src/_core/config/env.config';
import {
  comparePassword,
  createToken,
  hashPassword,
} from 'src/_core/helper/utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async userSignUp(body: SignUpDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new CommonException(MessageResponse.AUTH.EMAIL_EXIST);
    }

    const passwordHash = await hashPassword(password);

    const userCreated = await this.prisma.user.create({
      data: {
        ...body,
        password: passwordHash,
      },
    });

    const role = await this.prisma.role.findUnique({
      where: { name: ERole.USER },
    });

    await this.prisma.userRole.create({
      data: { userId: userCreated.id, roleId: role.id },
    });

    return {
      meta: MessageResponse.AUTH.SIGN_UP_SUCCESS,
      data: {
        id: userCreated.id,
        email: userCreated.email,
        firstName: userCreated.firstName,
        lastName: userCreated.lastName,
        avatar: userCreated.avatar,
        dob: userCreated.dob,
        gender: userCreated.gender,
        phoneNumber: userCreated.phoneNumber,
      },
    };
  }

  async userSignIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email, status: EUserStatus.ACTIVE },
      select: {
        id: true,
        email: true,
        status: true,
        password: true,
        userRoles: {
          select: {
            roleId: true,
          },
        },
      },
    });

    if (!user) {
      throw new CommonException(MessageResponse.USER.NOT_EXIST);
    }

    const isMatchPassword = await comparePassword(password, user.password);

    if (!isMatchPassword) {
      throw new CommonException(
        MessageResponse.AUTH.EMAIL_OR_PASSWORD_NOT_TRUE,
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      status: user.status,
      roleIds: user.userRoles,
    };
    const accessToken = await createToken(
      payload,
      this.configService.get(ENV.ACCESS_TOKEN_SECRET),
      this.configService.get(ENV.ACCESS_TOKEN_LIFE),
    );
    const refreshToken = await createToken(
      payload,
      this.configService.get(ENV.ACCESS_TOKEN_SECRET),
      this.configService.get(ENV.REFRESH_TOKEN_LIFE),
    );
    await this.prisma.user.update({
      where: { email },
      data: { accessToken, refreshToken },
    });

    return {
      meta: MessageResponse.AUTH.SIGN_IN_SUCCESS,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
