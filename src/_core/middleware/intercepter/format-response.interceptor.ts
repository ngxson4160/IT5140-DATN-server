import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from 'src/_core/type/response.type';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data: IApiResponse) => ({
        meta: {
          code: data.meta.code,
          statusCode: response.statusCode,
          message: data.meta.message,
          extraMeta: data.meta.extraMeta ? data.meta.extraMeta : {},
        },
        data: data.data ? data.data : null,
      })),
    );
  }
}
