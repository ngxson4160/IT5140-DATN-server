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
import { ESort } from 'src/_core/constant/enum.constant';
import { GetListCandidateDto } from './dto/get-list-candidate.dto';
import { GetListCompanyDto } from './dto/get-list-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompany(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        jobCategoryParent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!company) {
      throw new CommonException(MessageResponse.COMPANY.NOT_FOUND(id));
    }

    return {
      id: company.id,
      name: company.name,
      aboutUs: company.aboutUs,
      avatar: company.avatar,
      coverImage: company.coverImage,
      sizeType: company.sizeType,
      jobCategoryParent: company.jobCategoryParent,
      primaryAddress: company.primaryAddress,
      primaryEmail: company.primaryEmail,
      primaryPhoneNumber: company.primaryPhoneNumber,
      website: company.website,
      socialMedia: company.socialMedia,
    };
  }

  async getListCompany(query: GetListCompanyDto) {
    const { name, sortCreatedAt, page, limit } = query;

    const totalCompany = await this.prisma.company.count({
      where: {
        name: { contains: name },
      },
    });

    const listCompany = await this.prisma.company.findMany({
      where: {
        name: { contains: name },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: sortCreatedAt || ESort.DESC }],
    });

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalCompany / limit),
          totalItem: totalCompany,
        },
      },
      data: listCompany,
    };
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
      name,
      primaryEmail,
      taxCode,
      website,
      jobCategoryParentId,
      sizeType,
      primaryAddress,
      primaryPhoneNumber,
      aboutUs,
      avatar,
      coverImage,
    } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        company: {
          select: { id: true },
        },
      },
    });

    const company = await this.prisma.company.findUnique({
      where: { id: user.company.id },
    });

    if (company && company.id !== user.company.id) {
      throw new CommonException(MessageResponse.COMPANY.NAME_EXIST);
    }

    try {
      const companyUpdated = await this.prisma.$transaction(async (tx) => {
        const companyUpdated = await tx.company.update({
          where: { id: user.company.id },
          data: {
            name,
            primaryEmail,
            taxCode,
            website,
            jobCategoryParentId,
            sizeType,
            primaryAddress,
            primaryPhoneNumber,
            aboutUs,
            avatar,
            coverImage,
          },
        });

        return companyUpdated;
      });

      return companyUpdated;
    } catch (e) {
      throw e;
    }
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
    const { title, type, status, sortCreatedAt } = query;

    let {
      page,
      limit,
      // skip,
      order,
    } = query;

    page = page ?? 1;
    limit = limit ?? 5;
    order = order ?? EOrderPaging.DESC;

    let filterDate: object;

    if (type?.toString() !== '' && +type === EJobType.NOT_YET) {
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
        title: { contains: title },
        status: status ? +status : undefined,
        ...filterDate,
      },
      orderBy: {
        createdAt: sortCreatedAt || ESort.DESC,
      },
    });

    const skipItems = (+page - 1) * +limit;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +limit; i++) {
      if (listJob[i]) {
        listItems.push(listJob[i]);
      }
    }

    return {
      meta: {
        pagination: {
          page: +page,
          pageSize: +limit,
          totalPage: Math.ceil(listJob.length / limit),
        },
      },
      data: listItems,
    };
  }

  //TODO: Refactor query pagination
  async getJobsApplication(
    userId: number,
    jobId: number,
    query: GetListApplicationJobDto,
  ) {
    const { status } = query;

    let {
      page,
      limit,
      // skip,
      // order,
    } = query;

    page = page ?? 1;
    limit = limit ?? 5;

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

    const skipItems = (+page - 1) * +limit;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +limit; i++) {
      if (listApplication[i]) {
        listItems.push(listApplication[i]);
      }
    }

    return {
      meta: {
        pagination: {
          page: +page,
          pageSize: +limit,
          totalPage: Math.ceil(listApplication.length / limit),
        },
      },
      data: listItems,
    };
  }

  async getListCandidate(userId: number, query: GetListCandidateDto) {
    const { jobId, status, sortCreatedAt, limit, page } = query;

    const totalApplications = await this.prisma.application.count({
      where: {
        status,
        job: {
          id: jobId,
          creatorId: userId,
        },
      },
    });

    const listApplication = await this.prisma.application.findMany({
      where: {
        status,
        job: {
          id: jobId,
          creatorId: userId,
        },
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: sortCreatedAt || ESort.DESC,
        },
      ],
    });

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalApplications / limit),
          totalItem: totalApplications,
        },
      },
      data: listApplication,
    };
  }
}
