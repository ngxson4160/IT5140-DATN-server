import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/module/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorator/public.decorator';
import { UserActiveDto } from './dto/user-active.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.userSignUp(body);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.userSignIn(body);
  }

  @Public()
  @Get('user-active')
  async userActive(@Query() query: UserActiveDto, @Res() res: Response) {
    await this.authService.userActive(query);
    res.redirect('https://www.facebook.com/'); //TODO redirect Login Page
  }

  // @Role(ROLE.PILOT)
  // @Post('log-out')
  // async logOut(@Request() req) {
  //   return this.authService.logOut(req);
  // }

  // @Role(ROLE.PILOT, ROLE.ADMIN, ROLE.CUSTOMER, ROLE.TOUR_GUIDE)
  // @Get('profile')
  // async getProfile(@UserData() userInfo: UserDataType) {
  //   return this.authService.getProfile(userInfo.email);
  // }
}
