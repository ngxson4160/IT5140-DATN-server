import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategy/jwt-access.strategy';
import { UserModule } from 'src/module/user/user.module';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';

@Module({
  imports: [UserModule, NodeMailerModule],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
