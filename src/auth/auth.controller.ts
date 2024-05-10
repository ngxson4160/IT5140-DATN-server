import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { UserSignUpDto } from './dto/sign-up.dto';
import { Public } from './decorator/public.decorator';
import { UserActiveDto } from './dto/user-active.dto';
import { Response } from 'express';
import { UserData } from './decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CompanySignUpDto } from './dto/company-sign-up.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { ENV } from 'src/_core/config/env.config';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('/check-email')
  checkEmail(@Body() body: CheckEmailDto) {
    return this.authService.checkEmail(body);
  }

  @Public()
  @Post('user/sign-up')
  userSignUp(@Body() body: UserSignUpDto) {
    return this.authService.userSignUp(body);
  }

  @Public()
  @Post('company/sign-up')
  companySignUp(@Body() body: CompanySignUpDto) {
    return this.authService.companySignUp(body);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.userSignIn(body);
  }

  @Public()
  @Get('verify-account')
  async verifyAccount(@Query() query: UserActiveDto, @Res() res: Response) {
    await this.authService.verifyAccount(query);
    res.redirect(`${this.configService.get(ENV.DOMAIN_CLIENT)}/login`);
  }

  @Put('change-password')
  async changePassword(
    @UserData() userData: IUserData,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userData.id, body);
  }

  @Public()
  @Post('request-reset-password')
  requestPassword(@Body() body: RequestResetPasswordDto) {
    return this.authService.requestPassword(body);
  }

  @Public()
  @Put('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
