import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    NodeMailerService,
    NotificationGateway,
    NotificationService,
  ],
})
export class CompanyModule {}
