import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENV } from 'src/_core/config/env.config';
import { COMMON_CONSTANT } from 'src/_core/constant/common.constant';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { ConfigService } from '@nestjs/config';
import { IApiResponse } from 'src/_core/type/response.type';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  private logger = new Logger('😍😋😉 ResponseInterceptor');

  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    if (request.method === 'POST') {
      if (response.statusCode === 201)
        context.switchToHttp().getResponse().status(HttpStatus.OK);
    }

    return next.handle().pipe(
      map((data: IApiResponse) => {
        if (typeof data !== 'object') {
          return {
            meta: {
              code: MessageResponse.COMMON.OK.code,
              statusCode: MessageResponse.COMMON.OK.statusCode,
              message: MessageResponse.COMMON.OK.message,
            },
            data: data ? data : null,
          };
        }

        const res = context.switchToHttp().getResponse();
        const req = context.switchToHttp().getRequest();

        let responseData = {};

        if (!data?.meta && !data?.data) {
          responseData = {
            meta: {
              code: MessageResponse.COMMON.OK.code,
              statusCode: MessageResponse.COMMON.OK.statusCode,
              message: MessageResponse.COMMON.OK.message,
            },
            data: data,
          };
        } else {
          responseData = {
            meta: {
              code: data.meta?.code ?? MessageResponse.COMMON.OK.code,
              statusCode: res.statusCode,
              message: data.meta?.message ?? MessageResponse.COMMON.OK.message,
              ...data.meta,
            },
            data: data.data ? data.data : null,
          };
        }

        if (parseInt(this.configService.get(ENV.loggingEnable))) {
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
