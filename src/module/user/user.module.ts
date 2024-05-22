import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CandidateController } from './candidate.controller';
import { JobService } from '../job/job.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [],
  providers: [
    UserService,
    JobService,
    PrismaService,
    NotificationGateway,
    NotificationService,
  ],
  controllers: [UserController, CandidateController],
  exports: [UserService, PrismaService],
})
export class UserModule {}
