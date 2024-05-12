import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { ERole, EUserStatus } from 'src/_core/constant/enum.constant';
import { UserSignUpDto } from './dto/sign-up.dto';
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
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CompanySignUpDto } from './dto/company-sign-up.dto';
import { CheckEmailDto } from './dto/check-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly nodeMailer: NodeMailerService,
  ) {}

  async checkEmail(body: CheckEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      throw new CommonException(MessageResponse.AUTH.EMAIL_EXIST);
    }
  }

  async userSignUp(body: UserSignUpDto) {
    const {
      email,
      firstName,
      lastName,
      password,
      avatar,
      dob,
      gender,
      phoneNumber,
    } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new CommonException(MessageResponse.AUTH.EMAIL_EXIST);
    }

    const passwordHash = await hashPassword(password);
    try {
      const urlActive = await this.prisma.$transaction(async (tx) => {
        const userCreated = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            password: passwordHash,
            avatar,
            dob,
            gender,
            phoneNumber,
            status: EUserStatus.INACTIVE,
          },
        });

        const role = await tx.role.findUnique({
          where: { name: ERole.USER },
        });

        await tx.userRole.create({
          data: { userId: userCreated.id, roleId: role.id },
        });

        await tx.candidateInformation.create({
          data: {
            userId: userCreated.id,
            cv: [],
            certificate: [],
            education: [],
            workExperience: [],
            advancedSkill: [],
            languageSkill: [],
          },
        });

        const token = await createToken(
          { email },
          this.configService.get(ENV.COMMON_TOKEN_SECRET),
          this.configService.get(ENV.ACCESS_TOKEN_LIFE),
        );

        const urlActive = `${this.configService.get(
          ENV.DOMAIN,
        )}/auth/verify-account?email=${email}&token=${token}`;

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

        return urlActive;
      });

      return {
        meta: MessageResponse.AUTH.USER_SIGN_UP_SUCCESS(urlActive),
      };
    } catch (e) {
      throw e;
    }
    // const userCreated = await this.prisma.user.create({
    //   data: {
    //     email,
    //     firstName,
    //     lastName,
    //     password: passwordHash,
    //     avatar,
    //     dob,
    //     gender,
    //     phoneNumber,
    //     status: EUserStatus.INACTIVE,
    //   },
    // });

    // const role = await this.prisma.role.findUnique({
    //   where: { name: ERole.USER },
    // });

    // await this.prisma.userRole.create({
    //   data: { userId: userCreated.id, roleId: role.id },
    // });

    // const token = await createToken(
    //   { email },
    //   this.configService.get(ENV.COMMON_TOKEN_SECRET),
    //   this.configService.get(ENV.ACCESS_TOKEN_LIFE),
    // );

    // const urlActive = `${this.configService.get(
    //   ENV.DOMAIN,
    // )}/auth/verify-account?email=${email}&token=${token}`;

    // const context = {
    //   name: `${firstName} ${lastName}`,
    //   urlActive,
    // };

    // await this.nodeMailer.sendEmail(
    //   [email],
    //   COMMON_CONSTANT.VERIFY_ACCOUNT,
    //   HANDLEBARS_TEMPLATE_MAIL.USER_SIGN_UP,
    //   context,
    // );

    // return {
    //   meta: MessageResponse.AUTH.USER_SIGN_UP_SUCCESS(urlActive),
    // };
  }

  async companySignUp(body: CompanySignUpDto) {
    const { email, firstName, lastName, password, gender } = body.user;

    const {
      jobCategoryParentId,
      name,
      sizeType,
      primaryPhoneNumber,
      primaryAddress,
    } = body.company;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new CommonException(MessageResponse.AUTH.EMAIL_EXIST);
    }

    try {
      const urlActive = await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.findUnique({ where: { name } });

        if (company) {
          throw new CommonException(MessageResponse.COMPANY.NAME_EXIST);
        }

        const companyCreated = await tx.company.create({
          data: {
            jobCategoryParentId: +jobCategoryParentId,
            primaryEmail: email,
            name,
            sizeType: +sizeType,
            primaryPhoneNumber,
            primaryAddress,
            canCreateJob: true,
          },
        });

        // await tx.companyHasCity.create({
        //   data: {
        //     cityId,
        //     companyId: companyCreated.id,
        //   },
        // });

        const passwordHash = await hashPassword(password);
        const userCreated = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            password: passwordHash,
            gender,
            status: EUserStatus.INACTIVE,
            companyId: companyCreated.id,
          },
        });

        const role = await tx.role.findUnique({
          where: { name: ERole.COMPANY },
        });

        await tx.userRole.create({
          data: { userId: userCreated.id, roleId: role.id },
        });

        const token = await createToken(
          { email },
          this.configService.get(ENV.COMMON_TOKEN_SECRET),
          this.configService.get(ENV.ACCESS_TOKEN_LIFE),
        );

        const urlActive = `${this.configService.get(
          ENV.DOMAIN,
        )}/auth/verify-account?email=${email}&token=${token}`;

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

        return urlActive;
      });

      return {
        meta: MessageResponse.AUTH.COMPANY_SIGN_UP_SUCCESS(urlActive),
      };
    } catch (e) {
      throw e;
    }
  }

  async verifyAccount(query: UserActiveDto) {
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
        firstName: true,
        lastName: true,
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

    const roles = user.userRoles.map((role) => role.roleId);

    return {
      meta: MessageResponse.AUTH.SIGN_IN_SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          roles,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: accessToken,
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

  async requestPassword(body: RequestResetPasswordDto) {
    const { email } = body;

    const user = await this.prisma.user.findUnique({
      where: { email, status: EUserStatus.ACTIVE },
    });

    if (!user) {
      throw new CommonException(MessageResponse.USER.NOT_EXIST);
    }

    const token = await createToken(
      { email, id: user.id },
      this.configService.get(ENV.COMMON_TOKEN_SECRET),
      this.configService.get(ENV.ACCESS_TOKEN_LIFE),
    );

    //TODO change url to Reset password page
    const urlReset = `${this.configService.get(
      ENV.DOMAIN_CLIENT,
    )}/forgot-password/reset?token=${token}`;

    const context = {
      email,
      urlReset,
    };

    await this.nodeMailer.sendEmail(
      [email],
      COMMON_CONSTANT.RESET_PASSWORD,
      HANDLEBARS_TEMPLATE_MAIL.RESET_PASSWORD,
      context,
    );

    return {
      meta: MessageResponse.AUTH.REQUEST_RESET_PASSWORD_SUCCESS,
    };
  }

  //TODO invalid token when reset password successfully
  async resetPassword(body: ResetPasswordDto) {
    const { token, email, password } = body;

    const payload = (await verifyToken(
      token,
      this.configService.get(ENV.COMMON_TOKEN_SECRET),
    )) as JwtPayload;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new CommonException(MessageResponse.AUTH.RESET_PASSWORD_FAIL);
    }

    if (email === payload.data.email && user.id === payload.data.id) {
      const passwordHash = await hashPassword(password);

      await this.prisma.user.update({
        where: { email },
        data: { password: passwordHash },
      });
    } else {
      throw new CommonException(MessageResponse.AUTH.RESET_PASSWORD_FAIL);
    }

    return {
      meta: MessageResponse.AUTH.RESET_PASSWORD_SUCCESS,
    };
  }
}
