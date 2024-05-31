import { Injectable } from '@nestjs/common';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EApplicationStatus,
  EJobStatus,
  EPublicCVType,
  ERole,
  ESort,
} from 'src/_core/constant/enum.constant';
import { GetListApplicationDto } from './dto/get-list-applications.dto';
import { EOrderPaging } from 'src/_core/type/order-paging.type';
import { UpdateUserProfileDto } from './dto/update-candidate-profile.dto';
import { UserApplyJobDto } from './dto/user-apply-job.dto';
import { UpdateAccountInfoDto } from './dto/update-user-profile';
import { GetListCandidateDto } from './dto/get-list-candidate.dto';
import { FormatQueryArray, formatMessage } from 'src/_core/helper/utils';
import { NotificationGateway } from '../notification/notification.gateway';
import { NOTIFICATION_TEMPLATE } from 'src/_core/constant/common.constant';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async getAccountInfo(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    return user;
  }

  async updateAccountInfo(id: number, data: UpdateAccountInfoDto) {
    const { firstName, lastName, avatar } = data;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { firstName, lastName, avatar },
      select: {
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return userUpdated;
  }

  async getUserProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        userRoles: {
          some: {
            role: {
              name: ERole.USER,
            },
          },
        },
      },
      include: {
        city: true,
        district: true,
        candidateInformation: {
          include: {
            desiredJobCategory: true,
            desiredCity: true,
          },
        },
      },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    delete user.password;
    return user;
  }

  async updateUserProfile(id: number, body: UpdateUserProfileDto) {
    const {
      cityId,
      firstName,
      lastName,
      avatar,
      dob,
      gender,
      phoneNumber,
      districtId,
      maritalStatus,
      address,
      educationalLevel,

      //candidate information
      target,
      desiredJobCategoryId,
      desiredCityId,
      cv,
      yearExperience,
      workExperience,
      education,
      certificate,
      advancedSkill,
      languageSkill,
      desiredSalary,
      desiredJobLevel,
      desiredJobMode,
      publicCvType,
      project,
    } = body;

    let { publicAttachmentCv } = body;

    if (
      publicCvType === EPublicCVType.NOT_PUBLIC ||
      publicCvType === EPublicCVType.SYSTEM_CV
    ) {
      publicAttachmentCv = null;
    } else if (
      publicCvType === EPublicCVType.ATTACHMENT_CV &&
      !publicAttachmentCv
    ) {
      throw new CommonException(MessageResponse.USER.ATTACHMENT_CV_REQUIRED);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        userRoles: {
          some: {
            role: {
              name: ERole.USER,
            },
          },
        },
      },
    });

    if (!user) throw new CommonException(MessageResponse.USER.NOT_FOUND(id));

    const userUpdated = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        cityId,
        firstName,
        lastName,
        avatar,
        dob,
        gender,
        phoneNumber,
        districtId,
        maritalStatus,
        address,
        educationalLevel,
        candidateInformation: {
          update: {
            target,
            desiredJobCategoryId,
            desiredCityId,
            cv,
            yearExperience,
            workExperience,
            education,
            certificate,
            advancedSkill,
            languageSkill,
            project,
            desiredSalary,
            desiredJobLevel,
            desiredJobMode,
            publicCvType,
            publicAttachmentCv,
          },
        },
      },
      include: {
        city: true,
        district: true,
        candidateInformation: {
          include: {
            desiredJobCategory: true,
            desiredCity: true,
          },
        },
      },
    });

    delete userUpdated.password;
    return userUpdated;
  }

  async userApplyJob(userId: number, jobId: number, data: UserApplyJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId, status: EJobStatus.PUBLIC },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const application = await this.prisma.application.findFirst({
      where: {
        userId,
        jobId,
        version: job.version,
      },
    });

    if (application) {
      throw new CommonException(
        MessageResponse.APPLICATION.ALREADY_APPLICATION,
      );
    }

    const candidateInformation =
      await this.prisma.candidateInformation.findUnique({
        where: {
          userId,
        },
        include: {
          desiredJobCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

    try {
      const applicationCreated = await this.prisma.$transaction(async (tx) => {
        const applicationCreated = await tx.application.create({
          data: {
            userId,
            jobId,
            candidateCv: data?.candidateCv,
            candidateName: data.candidateName,
            candidatePhoneNumber: data.candidatePhoneNumber,
            candidateEmail: data.candidateEmail,
            cvType: data.cvType,
            ...(data.cvType === EPublicCVType.SYSTEM_CV && {
              systemCv: candidateInformation,
            }),
            version: job.version,
          },
        });

        await tx.job.update({
          where: {
            id: jobId,
          },
          data: {
            totalCandidate: job.totalCandidate + 1,
          },
        });

        if (job.allowNotification) {
          const notificationTemplate =
            await this.prisma.notificationTemplate.findUnique({
              where: {
                code: NOTIFICATION_TEMPLATE.CANDIDATE_APPLY_JOB,
              },
            });
          const content = formatMessage(notificationTemplate.content, [
            `${candidateInformation.user.firstName} ${candidateInformation.user.lastName}`,
            job.title,
          ]);
          const createNotification = {
            fromUserId: userId,
            toUserId: job.creatorId,
            content,
          };
          this.notificationGateway.createNotification(createNotification);
        }

        return applicationCreated;
      });

      return applicationCreated;
    } catch (e) {
      throw e;
    }
  }

  async userDeleteApplyJob(userId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId, status: EJobStatus.PUBLIC },
    });

    if (!job) {
      throw new CommonException(MessageResponse.JOB.NOT_FOUND(jobId));
    }

    const application = await this.prisma.application.findFirst({
      where: {
        userId,
        jobId,
        version: job.version,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!application) {
      throw new CommonException(MessageResponse.APPLICATION.NOT_FOUND);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.application.delete({
          where: {
            id: application.id,
          },
        });

        await tx.job.update({
          where: { id: jobId },
          data: {
            totalCandidate: --job.totalCandidate,
          },
        });

        if (job.allowNotification) {
          const notificationTemplate =
            await this.prisma.notificationTemplate.findUnique({
              where: {
                code: NOTIFICATION_TEMPLATE.CANDIDATE_DELETE_APPLY_JOB,
              },
            });
          const content = formatMessage(notificationTemplate.content, [
            `${application.user.firstName} ${application.user.lastName}`,
            job.title,
          ]);
          const createNotification = {
            fromUserId: userId,
            toUserId: job.creatorId,
            content,
          };
          this.notificationGateway.createNotification(createNotification);
        }
      });
    } catch (error) {}

    return;
  }

  async getListApplications(userId: number, query: GetListApplicationDto) {
    const { status } = query;
    let {
      page,
      limit,
      // skip,
      order,
    } = query;

    page = page ?? 1;
    limit = limit ?? 5;
    order = order ?? EOrderPaging.DESC;

    const listApplications = await this.prisma.application.findMany({
      where: {
        userId,
        status: status ? +status : undefined,
      },
      orderBy: [{ createdAt: ESort.DESC }],
      select: {
        id: true,
        userId: true,
        jobId: true,
        status: true,
        interviewSchedule: true,
        createdAt: true,
        createdBy: true,
        updatedAt: true,
        updatedBy: true,
        candidateCv: true,
        job: {
          select: {
            id: true,
            title: true,
            salaryMin: true,
            salaryMax: true,
            hiringEndDate: true,
            jobHasCities: {
              select: {
                city: true,
              },
            },
            jobHasTags: {
              select: {
                tag: true,
              },
            },
            creator: {
              select: {
                company: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    coverImage: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (listApplications.length === 0) {
      return {
        meta: {
          pagination: {
            page: +page,
            pageSize: +limit,
            totalPage: 0,
          },
        },
        data: [],
      };
    }

    const skipItems = (+page - 1) * +limit;
    const listItems = [];
    for (let i = skipItems; i < skipItems + +limit; i++) {
      if (listApplications[i]) {
        const company = listApplications[i].job.creator.company;
        delete listApplications[i].job.creator.company;
        listApplications[i].job['company'] = company;

        const cities = listApplications[i].job.jobHasCities.map((el) => ({
          id: el.city.id,
          name: el.city.name,
        }));
        delete listApplications[i].job.jobHasCities;
        listApplications[i].job['cities'] = cities;

        const tags = listApplications[i].job.jobHasTags.map((el) => ({
          id: el.tag.id,
          name: el.tag.name,
        }));
        delete listApplications[i].job.jobHasTags;
        listApplications[i].job['tags'] = tags;
        listItems.push(listApplications[i]);
      }
    }

    return {
      meta: {
        pagination: {
          page: +page,
          pageSize: +limit,
          totalPage: Math.ceil(listApplications.length / limit),
          totalItem: listApplications.length,
        },
      },
      data: listItems,
    };
  }

  async getListCandidate(query?: GetListCandidateDto) {
    const {
      filter,
      cityId,
      yearExperienceMin,
      yearExperienceMax,
      desiredJobCategoryIds,
      gender,
      desiredJobLevel,
      desiredJobMode,
      maritalStatus,
      educationalLevel,

      page,
      limit,
    } = query;

    const totalCandidate = await this.prisma.user.count({
      where: {
        candidateInformation: {
          publicCvType: {
            not: EPublicCVType.NOT_PUBLIC,
          },
          yearExperience: {
            lte: yearExperienceMax,
            gte: yearExperienceMin,
          },
          desiredJobCategory: {
            id: {
              in: desiredJobCategoryIds
                ? FormatQueryArray(desiredJobCategoryIds)
                : undefined,
            },
          },
          desiredJobLevel,
          desiredJobMode,
        },
        gender,
        maritalStatus,
        educationalLevel,
        cityId,
      },
    });

    const listCandidate = await this.prisma.user.findMany({
      where: {
        candidateInformation: {
          publicCvType: {
            not: EPublicCVType.NOT_PUBLIC,
          },
          yearExperience: {
            lte: yearExperienceMax,
            gte: yearExperienceMin,
          },
          desiredJobCategory: {
            id: {
              in: desiredJobCategoryIds
                ? FormatQueryArray(desiredJobCategoryIds)
                : undefined,
            },
          },
          desiredJobLevel,
          desiredJobMode,
        },
        gender,
        maritalStatus,
        educationalLevel,
        cityId,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        dob: true,
        gender: true,
        phoneNumber: true,
        district: true,
        maritalStatus: true,
        address: true,
        educationalLevel: true,
        status: true,
        city: {
          select: {
            id: true,
            name: true,
          },
        },
        candidateInformation: {
          select: {
            desiredJobCategory: {
              select: {
                id: true,
                name: true,
              },
            },
            desiredCityId: true,
            target: true,
            cv: true,
            yearExperience: true,
            workExperience: true,
            project: true,
            education: true,
            certificate: true,
            advancedSkill: true,
            languageSkill: true,
            desiredSalary: true,
            desiredJobLevel: true,
            desiredJobMode: true,
            publicCvType: true,
            publicAttachmentCv: true,
            status: true,
          },
        },
      },
    });

    const listCandidateConvert = listCandidate.map((el) => {
      if (
        el.candidateInformation.publicCvType === EPublicCVType.ATTACHMENT_CV
      ) {
        const candidate = {
          ...el,
          candidateInformation: {
            publicCvType: el.candidateInformation.publicCvType,
            publicAttachmentCv: el.candidateInformation.publicAttachmentCv,
          },
        };
        return candidate;
      } else {
        return el;
      }
    });

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalCandidate / limit),
          totalItem: totalCandidate,
        },
      },
      data: listCandidateConvert,
    };
  }
}
