import { Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyUpdateDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompany(id: number) {
    const company = await this.prisma.company.findUnique({ where: { id } });

    if (!company) {
      throw new CommonException(MessageResponse.COMPANY.NOT_FOUND(id));
    }

    return company;
  }

  async getMyCompany(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    return user.company;
  }

  async updateCompany(userId: number, data: CompanyUpdateDto) {
    const {
      jobCategoryParentId,
      name,
      extraEmail,
      aboutUs,
      avatar,
      coverImage,
      homePage,
      socialMedia,
      totalStaff,
      averageAge,
      primaryCity,
      extraCity,
      primaryAddress,
      extraAddress,
      primaryPhoneNumber,
      extraPhoneNumber,
    } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        company: {
          select: { id: true },
        },
      },
    });

    const company = await this.prisma.company.findUnique({ where: { name } });

    if (company && company.id !== user.company.id) {
      throw new CommonException(MessageResponse.COMPANY.NAME_EXIST);
    }

    const companyUpdated = await this.prisma.company.update({
      where: { id: user.company.id },
      data: {
        jobCategoryParentId,
        name,
        extraEmail,
        aboutUs,
        avatar,
        coverImage,
        homePage,
        socialMedia,
        totalStaff,
        averageAge,
        primaryCity,
        extraCity,
        primaryAddress,
        extraAddress,
        primaryPhoneNumber,
        extraPhoneNumber,
      },
    });

    return companyUpdated;
  }
}
