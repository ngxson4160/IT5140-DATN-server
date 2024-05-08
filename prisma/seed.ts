import { PrismaClient } from '@prisma/client';
import { DataCity } from 'src/_core/data/city-district';
import { JobCategory } from 'src/_core/data/job-category';
import { hashPassword } from 'src/_core/helper/utils';
const prisma = new PrismaClient();

const main = async () => {
  const password = '12345678';
  const passwordHash = await hashPassword(password);

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
      name: 'ABCxyz',
      primaryAddress: 'Đông Anh, Hà Nội',
      aboutUs: 'About us',
      sizeType: 10,
      primaryPhoneNumber: '0987654329',
      status: 1,
      canCreateJob: true,
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
      firstName: 'Nguyễn',
      lastName: 'Sơn',
      password: passwordHash,
      dob: new Date(),
      gender: 0,
      status: 1,
      cityId: 1,
      phoneNumber: '0987654321',
      district: 'Đông Anh',
      maritalStatus: 0,
      address: 'Vĩnh Ngọc',
      educationalLevel: 4,
    },
    {
      id: 3,
      email: 'company@gmail.com',
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
      cv: [
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/pdfs/037ba06b25150a28a174d7bd4fcf4a63e40edca35b29c315cc1bd50cfa31357bb1b0925c4e5a9e6acdbaa7f877899613f67dbe6a5d2ff82aab0b506b82d27a3f.pdf',
        'https://job-nest.s3.ap-southeast-1.amazonaws.com/pdfs/1d9f4f50e00c33b8867529d2bece5496ea949d949f0c0f011c8ef260301abd784af6b76509fb070c024417f601f943397196fae5eb71003599b260f42c15c1fa.pdf',
      ],
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
        { data: '123 BD, Quận Ba Đình, Hà Nội', cityId: 1, cityName: 'Hà Nội' },
        {
          data: '123 HK, Quận Hoàn Kiếm, Hà Nội',
          cityId: 1,
          cityName: 'Hà Nội',
        },
        {
          data: '123 DA, Huyện Đông Anh, Hà Nội',
          cityId: 1,
          cityName: 'Hà Nội',
        },
        {
          data: '123 Q1, Quận 1, Hồ Chí Minh',
          cityId: 79,
          cityName: 'Hồ Chí Minh',
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
