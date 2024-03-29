import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
// import { BackendConfigService } from '../services/backend-config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [NodeMailerService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: true,
          auth: {
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Job Nest" <Nguyen Xuan Son>`,
        },
        template: {
          dir: process.cwd() + '/dist/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [NodeMailerService],
})
export class NodeMailerModule {}
