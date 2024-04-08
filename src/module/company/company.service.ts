import { Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyUpdateDto } from './dto/update-company.dto';
import { ApplicationUpdateDto } from './dto/update-application.dto';
import { CompanyGetListJobDto } from './dto/get-list-job.dto';
import { EOrderPaging } from 'src/_core/type/order-paging.type';
import { EJobType } from 'src/_core/type/common.type';
import { GetListApplicationJobDto } from './dto/get-list-application.dto';

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

  async updateJobApplication(
    userId: number,
    jobId: number,
    applicationId: number,
    applicationUpdateDto: ApplicationUpdateDto,
  ) {
    //TODO Validate nếu đã interview rồi thì không thể rejectCV chẳng hạn???
    const { status, interviewSchedule, companyRemark } = applicationUpdateDto;
    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
        creatorId: userId,
      },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const application = await this.prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      throw new CommonException(
        MessageResponse.APPLICATION.NOT_FOUND(applicationId),
      );
    }

    const applicationUpdated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status, interviewSchedule, companyRemark },
    });

    return applicationUpdated;
  }

  async getListJob(creatorId: number, query: CompanyGetListJobDto) {
    const { status, type } = query;

    let {
      page,
      take,
      // skip,
      order,
    } = query;

    page = page ?? 1;
    take = take ?? 5;
    order = order ?? EOrderPaging.DESC;

    let filterDate: object;
    if (+type === EJobType.NOT_YET) {
      filterDate = {
        hiringStartDate: {
          gt: new Date(),
        },
      };
    } else if (+type === EJobType.IN_PROGRESS) {
      filterDate = {
        hiringStartDate: {
          lte: new Date(),
        },
        hiringEndDate: {
          gte: new Date(),
        },
      };
    } else if (+type === EJobType.EXPIRED) {
      filterDate = {
        hiringEndDate: {
          lt: new Date(),
        },
      };
    }

    const listJob = await this.prisma.job.findMany({
      where: {
        creatorId,
        status: status ? +status : undefined,
        ...filterDate,
      },
      orderBy: {
        createdAt: order,
      },
    });

    const skipItems = (+page - 1) * +take;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +take; i++) {
      if (listJob[i]) {
        listItems.push(listJob[i]);
      }
    }

    return {
      page: +page,
      pageSize: +take,
      totalPage: Math.ceil(listJob.length / take),
      listJob: listItems,
    };
  }

  async getJobsApplication(
    userId: number,
    jobId: number,
    query: GetListApplicationJobDto,
  ) {
    const { status } = query;

    let {
      page,
      take,
      // skip,
      // order,
    } = query;

    page = page ?? 1;
    take = take ?? 5;

    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
        creatorId: userId,
      },
      include: {
        applications: true,
      },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    // const listApplication = job.applications;
    let listApplication = [];

    if (status) {
      job.applications.forEach((application) => {
        if (application.status === +status) listApplication.push(application);
      });
    } else {
      listApplication = job.applications;
    }

    const skipItems = (+page - 1) * +take;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +take; i++) {
      if (listApplication[i]) {
        listItems.push(listApplication[i]);
      }
    }

    return {
      page: +page,
      pageSize: +take,
      totalPage: Math.ceil(listApplication.length / take),
      listApplications: listItems,
    };
  }
}
