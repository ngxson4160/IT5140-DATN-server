import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CandidateController } from './candidate.controller';
import { JobService } from '../job/job.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [UserService, JobService],
  controllers: [UserController, CandidateController],
  exports: [UserService],
})
export class UserModule {}
