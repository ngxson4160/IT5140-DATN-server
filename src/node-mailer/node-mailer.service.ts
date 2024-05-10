import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  private readonly logger = new Logger(NodeMailerService.name);
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(
    receivers: Array<string>,
    subject: string,
    template: string,
    context: object,
  ) {
    this.mailerService
      .sendMail({
        to: receivers, // list of receivers
        subject,
        template: template, // name of the Handlebar template file
        context: context,
      })
      .then((rs) => {})
      .catch((err) => {
        this.logger.error(`Send mail error: ${err}`);
      });
  }
}
