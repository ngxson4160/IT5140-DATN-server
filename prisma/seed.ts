import { PrismaClient } from '@prisma/client';
import {
  CONFIGURATION,
  NOTIFICATION_TEMPLATE,
} from 'src/_core/constant/common.constant';
import { DataCity } from 'src/_core/data/city-district';
import { JobCategory } from 'src/_core/data/job-category';
import { hashPassword } from 'src/_core/helper/utils';
const prisma = new PrismaClient();

const main = async () => {
  const password = '12345678';
  const passwordHash = await hashPassword(password);

  /**
   * configuration
   */
  const configurations = [
    {
      id: 1,
      key: CONFIGURATION.USER_AVATAR_DEFAULT,
      value:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/user-avatar-default.jpg',
    },
    {
      id: 2,
      key: CONFIGURATION.COMPANY_AVATAR_DEFAULT,
      value:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/company-avatar-default.jpg',
    },
    {
      id: 3,
      key: CONFIGURATION.COMPANY_COVER_IMAGE_DEFAULT,
      value:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/company-cover-default.png',
    },
  ];
  const configurationPromise = configurations.map((configuration) => {
    return prisma.configuration.upsert({
      where: {
        id: configuration.id,
      },
      create: configuration,
      update: configuration,
    });
  });
  await Promise.all(configurationPromise);

  /**
   * notification template
   */
  const notificationTemplates = [
    {
      id: 1,
      code: NOTIFICATION_TEMPLATE.CANDIDATE_APPLY_JOB,
      content:
        '<p>Ứng viên <strong>{0}</strong> đã ứng tuyển vào công việc <strong>{1}</strong></p>',
    },
    {
      id: 2,
      code: NOTIFICATION_TEMPLATE.CANDIDATE_DELETE_APPLY_JOB,
      content:
        '<p>Ứng viên <strong>{0}</strong> đã hủy ứng tuyển vào công việc <strong>{1}</strong></p>',
    },
    {
      id: 3,
      code: NOTIFICATION_TEMPLATE.COMPANY_UPDATE_APPLICATION_STATUS,
      content:
        '<p>Công ty <strong>{0}</strong> đã cập nhật trạng thái <strong>{1}</strong> cho hồ sơ ứng tuyển vào công việc <strong>{2}</strong></p>',
    },
    {
      id: 4,
      code: NOTIFICATION_TEMPLATE.COMPANY_ADD_INTERVIEW_SCHEDULE,
      content:
        '<p>Công ty <strong>{0}</strong> đã thêm lịch phỏng vấn vào lúc <strong>{1}</strong> cho công việc <strong>{2}</strong></p>',
    },
    {
      id: 5,
      code: NOTIFICATION_TEMPLATE.COMPANY_DELETE_JOB,
      content:
        '<p>Công ty <strong>{0}</strong> đã loại bỏ công việc <strong>{1}</strong></p>',
    },
    {
      id: 6,
      code: NOTIFICATION_TEMPLATE.COMPANY_VIEW_CV,
      content:
        '<p>Hồ sơ của bạn đã được xem bởi công ty <strong>{0}</strong></p>',
    },
  ];
  const notificationTemplatePromise = notificationTemplates.map(
    (notificationTemplate) => {
      return prisma.notificationTemplate.upsert({
        where: {
          id: notificationTemplate.id,
        },
        create: notificationTemplate,
        update: notificationTemplate,
      });
    },
  );
  await Promise.all(notificationTemplatePromise);

  //**City */
  const cityDistrict = DataCity.map((city) => {
    return prisma.city.upsert({
      where: {
        id: city.id,
      },
      create: {
        id: city.id,
        name: city.name,
        districts: {
          createMany: {
            data: city.districts.map((district) => {
              return {
                id: district.id,
                name: district.name,
              };
            }),
          },
        },
      },
      update: {
        id: city.id,
        name: city.name,
      },
    });
  });
  await Promise.all(cityDistrict);

  const jobCategoryParent = JobCategory.map((jobParent) => {
    return prisma.jobCategoryParent.upsert({
      where: {
        id: jobParent.id,
      },
      create: {
        id: jobParent.id,
        name: jobParent.name,
        jobCategories: {
          createMany: {
            data: jobParent.jobCategory.map((jobCategory) => {
              return {
                id: jobCategory.id,
                name: jobCategory.name,
              };
            }),
          },
        },
      },
      update: {
        id: jobParent.id,
        name: jobParent.name,
        // jobCategories: {
        //   updateMany: {
        //     where: {
        //       id: {
        //         in: jobParent.jobCategory.map((jobCategory) => jobCategory.id),
        //       },
        //     },
        //     data: jobParent.jobCategory.map((jobCategory) => {
        //       return {
        //         id: jobCategory.id,
        //         name: jobCategory.name,
        //       };
        //     }),
        //   },
        // },
      },
    });
  });
  await Promise.all(jobCategoryParent);

  const companies = [
    {
      id: 1,
      jobCategoryParentId: 1,
      primaryEmail: 'company@gmail.com',
      name: 'TNHH NXS',
      primaryAddress: 'Đông Anh, Hà Nội',
      aboutUs: 'About us',
      sizeType: 0,
      primaryPhoneNumber: '0987654329',
      status: 1,
      canCreateJob: true,
      avatar:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/company-avatar-default.jpg',
      coverImage:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/company-cover-default.png',
    },
  ];
  const companyPromise = companies.map((company) => {
    return prisma.company.upsert({
      where: {
        id: company.id,
      },
      create: company,
      update: company,
    });
  });
  await Promise.all(companyPromise);

  //** USER */
  const users = [
    {
      id: 1,
      email: 'admin@gmail.com',
      avatar: 'https://job-nest.s3.ap-southeast-1.amazonaws.com/logo.jpg',
      firstName: '',
      lastName: 'Admin',
      password: passwordHash,
      dob: new Date(),
      gender: 0,
      status: 1,
    },
    {
      id: 2,
      email: 'user@gmail.com',
      avatar:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/user-avatar-default.jpg',
      firstName: 'Nguyễn',
      lastName: 'Sơn',
      password: passwordHash,
      dob: new Date(),
      gender: 0,
      status: 1,
      cityId: 1,
      phoneNumber: '0987654321',
      districtId: 1,
      maritalStatus: 0,
      address: 'Vĩnh Ngọc',
      educationalLevel: 4,
    },
    {
      id: 3,
      email: 'company@gmail.com',
      avatar:
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/user-avatar-default.jpg',
      firstName: 'Job',
      lastName: 'Nest',
      password: passwordHash,
      dob: new Date(),
      gender: 0,
      status: 1,
      companyId: 1,
    },
  ];
  const userPromise = users.map((user) => {
    return prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: user,
      update: user,
    });
  });
  await Promise.all(userPromise);

  //** ROLE */
  const roles = [
    {
      id: 1,
      name: 'ROOT',
    },
    {
      id: 2,
      name: 'ADMIN',
    },
    {
      id: 3,
      name: 'COMPANY',
    },
    {
      id: 4,
      name: 'USER',
    },
  ];
  const rolePromise = roles.map((role) => {
    return prisma.role.upsert({
      where: {
        id: role.id,
      },
      create: role,
      update: role,
    });
  });
  await Promise.all(rolePromise);

  //** USER - ROLE */
  const userRoles = [
    {
      userId: 1,
      roleId: 1,
    },
    { userId: 2, roleId: 4 },
    { userId: 3, roleId: 3 },
  ];
  const userRolePromise = userRoles.map((userRole) => {
    return prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: userRole.userId, roleId: userRole.roleId },
      },
      create: userRole,
      update: userRole,
    });
  });
  await Promise.all(userRolePromise);

  //** PERMISSION */
  const permissions = [
    //AuthController
    {
      id: 1,
      action: 'AuthController.changePassword',
    },
    {
      id: 2,
      action: 'AuthController.userSignIn',
    },
    {
      id: 3,
      action: 'AuthController.userSignUp',
    },
    {
      id: 4,
      action: 'AuthController.userVerify',
    },

    //CompanyController
    {
      id: 5,
      action: 'CompanyController.getJobsApplication',
    },
    {
      id: 6,
      action: 'CompanyController.getListJob',
    },
    {
      id: 7,
      action: 'CompanyController.getMyCompany',
    },
    {
      id: 8,
      action: 'CompanyController.updateJobApplication',
    },
    {
      id: 9,
      action: 'CompanyController.updateMyCompany',
    },

    //FileController
    {
      id: 10,
      action: 'FileController.uploadImagesToS3',
    },
    {
      id: 11,
      action: 'FileController.uploadPdfsToS3',
    },

    //JobController
    {
      id: 12,
      action: 'JobController.createJob',
    },
    {
      id: 13,
      action: 'JobController.deleteJob',
    },
    {
      id: 14,
      action: 'JobController.getJob',
    },
    {
      id: 15,
      action: 'JobController.getListJob',
    },
    {
      id: 16,
      action: 'JobController.updateJob',
    },

    //UserController
    {
      id: 17,
      action: 'UserController.getListApplications',
    },
    {
      id: 18,
      action: 'UserController.updateUser',
    },
    {
      id: 19,
      action: 'UserController.userApplyJob',
    },
    {
      id: 20,
      action: 'UserController.userDeleteApplyJob',
    },
    {
      id: 21,
      action: 'UserController.getMyProfile',
    },
    {
      id: 22,
      action: 'UserController.updateMyProfile',
    },
    {
      id: 23,
      action: 'CompanyController.getListCandidate',
    },
    {
      id: 24,
      action: 'UserController.getAccountInfo',
    },
    {
      id: 25,
      action: 'UserController.updateAccountInfo',
    },
    {
      id: 26,
      action: 'CandidateController.getListCandidate',
    },
    {
      id: 27,
      action: 'JobController.followJob',
    },
    {
      id: 28,
      action: 'UserController.userListFavorite',
    },
    {
      id: 29,
      action: 'NotificationController.getListNotification',
    },
    {
      id: 30,
      action: 'NotificationController.updateManyNotification',
    },
    {
      id: 31,
      action: 'ConversationController.createConversationPair',
    },
    {
      id: 32,
      action: 'ConversationController.getMessageConversation',
    },
    {
      id: 33,
      action: 'ConversationController.getListConversation',
    },
    {
      id: 34,
      action: 'JobController.reopenJob',
    },
    {
      id: 35,
      action: 'ConversationController.getConversationDetail',
    },
    {
      id: 36,
      action: 'BlogController.createBlog',
    },
    {
      id: 37,
      action: 'BlogController.getDetail',
    },
    {
      id: 38,
      action: 'BlogController.getListBlog',
    },
    {
      id: 39,
      action: 'BlogController.deleteBlog',
    },
    {
      id: 40,
      action: 'BlogController.updateBlog',
    },
    {
      id: 41,
      action: 'BlogController.userFollowBlog',
    },
    {
      id: 42,
      action: 'CompanyController.companyViewProfileCandidate',
    },
    {
      id: 43,
      action: 'JobController.recommendJob',
    },
  ];

  const permissionPromise = permissions.map((permission) => {
    return prisma.permission.upsert({
      where: {
        id: permission.id,
      },
      create: permission,
      update: permission,
    });
  });
  await Promise.all(permissionPromise);

  //** ROLE - PERMISSION */
  const roleRootPermission = permissions.map((permission) => ({
    roleId: 1,
    permissionId: permission.id,
  }));

  let rolePermissions = [
    //ENTERPRISE
    {
      roleId: 3,
      permissionId: 1,
    },
    {
      roleId: 3,
      permissionId: 2,
    },
    {
      roleId: 3,
      permissionId: 3,
    },
    {
      roleId: 3,
      permissionId: 4,
    },
    {
      roleId: 3,
      permissionId: 5,
    },
    {
      roleId: 3,
      permissionId: 6,
    },
    {
      roleId: 3,
      permissionId: 7,
    },
    {
      roleId: 3,
      permissionId: 8,
    },
    {
      roleId: 3,
      permissionId: 9,
    },
    {
      roleId: 3,
      permissionId: 10,
    },
    {
      roleId: 3,
      permissionId: 11,
    },
    {
      roleId: 3,
      permissionId: 12,
    },
    {
      roleId: 3,
      permissionId: 13,
    },
    {
      roleId: 3,
      permissionId: 14,
    },
    {
      roleId: 3,
      permissionId: 15,
    },
    {
      roleId: 3,
      permissionId: 16,
    },
    {
      roleId: 3,
      permissionId: 23,
    },
    {
      roleId: 3,
      permissionId: 24,
    },
    {
      roleId: 3,
      permissionId: 25,
    },
    {
      roleId: 3,
      permissionId: 26,
    },
    {
      roleId: 3,
      permissionId: 29,
    },
    {
      roleId: 3,
      permissionId: 30,
    },
    {
      roleId: 3,
      permissionId: 31,
    },
    {
      roleId: 3,
      permissionId: 32,
    },
    {
      roleId: 3,
      permissionId: 33,
    },
    {
      roleId: 3,
      permissionId: 34,
    },
    {
      roleId: 3,
      permissionId: 35,
    },
    {
      roleId: 3,
      permissionId: 36,
    },
    {
      roleId: 3,
      permissionId: 37,
    },
    {
      roleId: 3,
      permissionId: 38,
    },
    {
      roleId: 3,
      permissionId: 39,
    },
    {
      roleId: 3,
      permissionId: 40,
    },
    {
      roleId: 3,
      permissionId: 41,
    },
    {
      roleId: 3,
      permissionId: 42,
    },

    //USER
    {
      roleId: 4,
      permissionId: 1,
    },
    {
      roleId: 4,
      permissionId: 2,
    },
    {
      roleId: 4,
      permissionId: 3,
    },
    {
      roleId: 4,
      permissionId: 4,
    },
    {
      roleId: 4,
      permissionId: 10,
    },
    {
      roleId: 4,
      permissionId: 11,
    },
    {
      roleId: 4,
      permissionId: 14,
    },
    {
      roleId: 4,
      permissionId: 15,
    },
    {
      roleId: 4,
      permissionId: 17,
    },
    {
      roleId: 4,
      permissionId: 18,
    },
    {
      roleId: 4,
      permissionId: 19,
    },
    {
      roleId: 4,
      permissionId: 20,
    },
    {
      roleId: 4,
      permissionId: 21,
    },
    {
      roleId: 4,
      permissionId: 22,
    },
    {
      roleId: 4,
      permissionId: 24,
    },
    {
      roleId: 4,
      permissionId: 25,
    },
    {
      roleId: 4,
      permissionId: 27,
    },
    {
      roleId: 4,
      permissionId: 28,
    },
    {
      roleId: 4,
      permissionId: 29,
    },
    {
      roleId: 4,
      permissionId: 30,
    },
    {
      roleId: 4,
      permissionId: 31,
    },
    {
      roleId: 4,
      permissionId: 32,
    },
    {
      roleId: 4,
      permissionId: 33,
    },
    {
      roleId: 4,
      permissionId: 35,
    },
    {
      roleId: 4,
      permissionId: 37,
    },
    {
      roleId: 4,
      permissionId: 38,
    },
    {
      roleId: 4,
      permissionId: 41,
    },
    {
      roleId: 4,
      permissionId: 43,
    },
  ];

  rolePermissions = [...rolePermissions, ...roleRootPermission];

  const rolePermissionPromise = rolePermissions.map((rolePermission) => {
    return prisma.rolePermission.upsert({
      where: {
        permissionId_roleId: {
          permissionId: rolePermission.permissionId,
          roleId: rolePermission.roleId,
        },
      },
      create: rolePermission,
      update: rolePermission,
    });
  });
  await Promise.all(rolePermissionPromise);

  const candidateInformation = [
    {
      id: 1,
      userId: 2,
      desiredJobCategoryId: 1,
      desiredCityId: 4,
      target: 'Đi làm kiếm tiền',
      cv: [],
      yearExperience: 10,
      workExperience: [
        {
          position: 'Thực tập',
          companyName: 'Openway',
          start: '2023-07-27T19:36:59.680Z',
          end: '2023-09-30T19:36:59.680Z',
          description: 'Description',
        },
        {
          position: 'Thực tập',
          companyName: 'WanoSoft',
          start: '2023-10-27T19:36:59.680Z',
          end: '',
          description: 'Description',
        },
      ],
      education: [
        {
          name: 'Cử nhân',
          major: 'Khoa học máy tính',
          organization: 'Trường CNTT&TT, Đại học Bách Khoa Hà Nội',
          start: '2019-09-05T00:00:00.000Z',
          end: '2023-09-05T00:00:00.000Z',
          description: 'Description',
        },
        {
          name: 'Kỹ Sư',
          major: 'Khoa học máy tính',
          organization: 'Trường CNTT&TT, Đại học Bách Khoa Hà Nội',
          start: '2023-09-05T00:00:00.000Z',
          end: '2024-09-05T00:00:00.000Z',
          description: 'Description',
        },
      ],
      certificate: [
        {
          name: 'Linux',
          major: 'Công nghệ thông tin',
          organization: 'Organization',
          start: '2023-09-05T00:00:00.000Z',
          end: '2024-09-05T00:00:00.000Z',
          description: 'Description',
        },
        {
          name: 'Kafka',
          major: 'Công nghệ thông tin',
          organization: 'Organization',
          start: '2023-09-05T00:00:00.000Z',
          end: '2024-09-05T00:00:00.000Z',
          description: 'Description',
        },
      ],
      advancedSkill: [
        {
          name: 'NodeJS',
          level: 50,
        },
        {
          name: 'VueJS',
          level: 40,
        },
        {
          name: 'SQL',
          level: 30,
        },
        {
          name: 'Java',
          level: 60,
        },
      ],
      languageSkill: [
        {
          name: 'Anh',
          level: 30,
        },
        {
          name: 'Việt',
          level: 90,
        },
      ],
      desiredSalary: 100000000,
      desiredJobLevel: 1,
      desiredJobMode: 1,
      status: 1,
    },
  ];

  const candidateInformationPromise = candidateInformation.map(
    (information) => {
      return prisma.candidateInformation.upsert({
        where: {
          id: information.id,
        },
        create: information,
        update: information,
      });
    },
  );
  await Promise.all(candidateInformationPromise);

  const jobs = [
    {
      id: 1,
      creatorId: 3,
      jobCategoryId: 1,
      title: 'Tuyển intern NodeJS/ReactJS',
      salaryMin: 4000000,
      salaryMax: 6000000,
      jobMode: 0,
      level: 0,
      address: [
        {
          cityId: 2,
          address: [
            { data: 'Thành phố Hà Giang', districtId: null, districtName: '' },
          ],
          cityName: 'Hà Giang',
        },
        {
          cityId: 1,
          address: [
            { data: '', districtId: null, districtName: 'Quận Hoàn Kiếm' },
          ],
          cityName: 'Hà Nội',
        },
      ],
      quantity: 3,
      benefits: 'Benefit',
      description: 'Description',
      requirement: 'Requirement',
      time: 'T2-T6 8:30 A.M to 18:00 P.M',
      yearExperience: 1,
      hiringStartDate: new Date(),
      hiringEndDate: new Date('2025-04-27T19:15:47.347Z'),
      status: 1,
    },
  ];

  const job = jobs.map((job) => {
    return prisma.job.upsert({
      where: {
        id: job.id,
      },
      create: job,
      update: job,
    });
  });
  await Promise.all(job);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
