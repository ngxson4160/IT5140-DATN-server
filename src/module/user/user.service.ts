import { BadRequestException, Body, Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_core/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getDetail(id: number) {
    const userFound = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!userFound) throw new BadRequestException('asdads');

    return {
      message: 'sdfsdf',
      data: userFound,
    };
  }
}
