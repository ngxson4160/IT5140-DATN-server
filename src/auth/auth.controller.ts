import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/module/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorator/public.decorator';
import { UserActiveDto } from './dto/user-active.dto';
import { Response } from 'express';
import { UserData } from './decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('user/sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.userSignUp(body);
  }

  @Public()
  @Post('user/sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.userSignIn(body);
  }

  @Public()
  @Get('user/verify')
  async userVerify(@Query() query: UserActiveDto, @Res() res: Response) {
    await this.authService.userVerify(query);
    res.redirect('https://www.facebook.com/'); //TODO redirect Login Page
  }

  @Post('user/change-password')
  async changePassword(
    @UserData() userData: IUserData,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userData.id, body);
  }
}
