import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CandidateController } from './candidate.controller';
import { JobService } from '../job/job.service';

@Module({
  imports: [],
  providers: [UserService, JobService, PrismaService],
  controllers: [UserController, CandidateController],
  exports: [UserService, PrismaService],
})
export class UserModule {}
