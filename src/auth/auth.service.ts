import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/_core/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { ERole, EUserStatus } from 'src/_core/constant/enum.constant';
import { SignUpDto } from './dto/sign-up.dto';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, parseInt(process.env.AUTH_SALT_ROUND));
  }

  async comparePassword(
    inputPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, userPassword);
  }

  async createToken(
    payload: any,
    privateKey: string,
    tokenLife: string,
  ): Promise<string> {
    return sign({ data: payload }, privateKey, { expiresIn: tokenLife });
  }

  async verifyToken(token: string, privateKey: string) {
    return verify(token, privateKey);
  }

  async signUp(body: SignUpDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new CommonException(MessageResponse.AUTH.EMAIL_EXIST);
    }

    const passwordHash = await this.hashPassword(password);

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

  async signIn(body: SignInDto) {
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

    const isMatchPassword = await this.comparePassword(password, user.password);

    if (!isMatchPassword) {
      throw new CommonException(
        MessageResponse.AUTH.EMAIL_OR_PASSWORD_NOT_TRUE,
      );
    }
    console.log(user.userRoles);

    const payload = {
      id: user.id,
      email: user.email,
      status: user.status,
      roleIds: user.userRoles,
    };
    const accessToken = await this.createToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE,
    );
    const refreshToken = await this.createToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFE,
    );
    const userUpdated = await this.prisma.user.update({
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
