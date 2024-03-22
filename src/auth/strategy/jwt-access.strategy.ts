import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/_core/prisma/prisma.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true, //pass to validate below
    });
  }

  async validate(req: Request & { permission: string }, payload: JwtPayload) {
    const { data } = payload;

    for (const role of data.roleIds) {
      const permission = await this.prisma.rolePermission.findFirst({
        where: {
          roleId: role.roleId,
          permission: {
            action: req.permission,
          },
        },
      });

      if (permission) {
        return payload; //attach to request object
      }
    }

    throw new CommonException(MessageResponse.COMMON.FORBIDDEN);
  }
}
