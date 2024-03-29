import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'src/_core/config/env.config';

@Module({
  providers: [NodeMailerService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get(ENV.MAIL_HOST),
          secure: true,
          auth: {
            user: configService.get(ENV.MAIL_USERNAME),
            pass: configService.get(ENV.MAIL_PASSWORD),
          },
        },
        defaults: {
          from: 'Job Nest',
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
