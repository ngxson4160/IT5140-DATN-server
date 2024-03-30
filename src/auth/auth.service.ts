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
  verifyToken,
} from 'src/_core/helper/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActiveDto } from './dto/user-active.dto';
import { JwtPayload } from 'jsonwebtoken';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import {
  COMMON_CONSTANT,
  HANDLEBARS_TEMPLATE_MAIL,
} from 'src/_core/constant/common.constant';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly nodeMailer: NodeMailerService,
  ) {}

  async userSignUp(body: SignUpDto) {
    const { email, password, firstName, lastName } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new CommonException(MessageResponse.AUTH.EMAIL_EXIST);
    }

    const passwordHash = await hashPassword(password);

    const userCreated = await this.prisma.user.create({
      data: {
        ...body,
        password: passwordHash,
        status: EUserStatus.INACTIVE,
      },
    });

    const role = await this.prisma.role.findUnique({
      where: { name: ERole.USER },
    });

    await this.prisma.userRole.create({
      data: { userId: userCreated.id, roleId: role.id },
    });

    const token = await createToken(
      { email },
      this.configService.get(ENV.COMMON_TOKEN_SECRET),
      this.configService.get(ENV.ACCESS_TOKEN_LIFE),
    );

    const urlActive = `${this.configService.get(
      ENV.DOMAIN,
    )}/auth/user/verify?email=${email}&token=${token}`;

    const context = {
      name: `${firstName} ${lastName}`,
      urlActive,
    };

    await this.nodeMailer.sendEmail(
      [email],
      COMMON_CONSTANT.VERIFY_ACCOUNT,
      HANDLEBARS_TEMPLATE_MAIL.USER_SIGN_UP,
      context,
    );

    return {
      meta: MessageResponse.AUTH.SIGN_UP_SUCCESS(urlActive),
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

  async userVerify(query: UserActiveDto) {
    const { email, token } = query;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.status === EUserStatus.ACTIVE) {
      throw new CommonException(MessageResponse.AUTH.ACTIVE_ACCOUNT_FAIL);
    }

    const payload = (await verifyToken(
      token,
      this.configService.get(ENV.COMMON_TOKEN_SECRET),
    )) as JwtPayload;

    if (email === payload.data.email) {
      await this.prisma.user.update({
        where: { email },
        data: { status: EUserStatus.ACTIVE },
      });
    } else {
      throw new CommonException(MessageResponse.AUTH.ACTIVE_ACCOUNT_FAIL);
    }
  }

  async userSignIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
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

    if (user.status === EUserStatus.INACTIVE) {
      throw new CommonException(MessageResponse.AUTH.ACTIVE_ACCOUNT);
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

  async changePassword(userId: number, body: ChangePasswordDto) {
    const { oldPassword, newPassword } = body;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new CommonException(MessageResponse.USER.NOT_FOUND(userId));
    }

    const isMatchPassword = await comparePassword(oldPassword, user.password);

    if (!isMatchPassword) {
      throw new CommonException(MessageResponse.AUTH.PASSWORD_INCORRECT);
    }

    const newPasswordHash = await hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return {
      meta: MessageResponse.AUTH.CHANGE_PASSWORD_SUCCESS,
    };
  }
}
