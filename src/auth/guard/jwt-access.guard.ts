import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { DECORATOR_KEY } from 'src/_core/constant/common.constant';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const methodHandlerRequest = context.getHandler().name;
    const classHandlerRequest = context.getClass().name;
    req.permission = `${classHandlerRequest}.${methodHandlerRequest}`;

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      DECORATOR_KEY.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
