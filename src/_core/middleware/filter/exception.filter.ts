import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_CONSTANT } from 'src/_core/constant/common.constant';
import { IApiMeta, IApiResponse } from 'src/_core/type/response.type';

export class CommonException extends HttpException {
  constructor(response: IApiMeta, cause?: any) {
    super(response, response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    this.stack = cause;
  }
}
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('😔😕😣 HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof InternalServerErrorException) {
      exception = new CommonException(
        MessageResponse.HTTPS.INTERNAL_SERVER_ERROR,
        exception.stack,
      );
    } else if (exception instanceof UnauthorizedException) {
      exception = new CommonException(MessageResponse.HTTPS.UNAUTHORIZED);
    } else if (!(exception instanceof HttpException)) {
      console.log(exception);
      exception = new CommonException(
        MessageResponse.HTTPS.INTERNAL_SERVER_ERROR,
      );
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorLog = {
      timestamp: moment().format(COMMON_CONSTANT.LOG_TIMESTAMP_FORMAT),
      id: uuidv4(),
      request: {
        variables: req.body['variables'],
        query: req.body['query'],
        params: req.body['params'],
        ip: req.ip,
        userAgent: req.get('user-agent'),
        token: req.headers['authorization'],
      },
      response: exception.getResponse() as IApiResponse,
    };

    this.logger.error(JSON.stringify(errorLog));

    res.status(status).json({
      meta: exception.getResponse(),
      data: null,
    });
  }
}
