import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMON_CONSTANT } from 'src/_core/constant/common.constant';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { IApiResponse } from 'src/_core/interface/response.type';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  private logger = new Logger('😍😋😉 ResponseInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: IApiResponse) => {
        const res = context.switchToHttp().getResponse();
        const req = context.switchToHttp().getRequest();

        let responseData = {};

        if (!data.meta || !data.data) {
          responseData = {
            meta: {
              code: MessageResponse.COMMON.OK.code,
              statusCode: MessageResponse.COMMON.OK.statusCode,
              message: MessageResponse.COMMON.OK.message,
              extraMeta: {},
            },
            data: data,
          };
        } else {
          responseData = {
            meta: {
              code: data.meta.code,
              statusCode: res.statusCode,
              message: data.meta.message,
              extraMeta: data.meta.extraMeta ? data.meta.extraMeta : {},
            },
            data: data.data ? data.data : null,
          };
        }

        if (parseInt(process.env.loggingEnable)) {
          const responseLog = {
            timestamp: moment().format(COMMON_CONSTANT.LOG_TIMESTAMP_FORMAT),
            request: {
              variables: req.body['variables'],
              query: req.body['query'],
              params: req.body['params'],
              ip: req.ip,
              userAgent: req.get('user-agent'),
              token: req.headers['authorization'],
            },
            response: responseData,
          };

          this.logger.debug(JSON.stringify(responseLog));
        }

        return responseData;
      }),
    );
  }
}
