import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/module/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.userSignUp(body);
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return this.authService.userSignIn(body);
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
