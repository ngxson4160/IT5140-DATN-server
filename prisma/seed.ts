import { PrismaClient } from '@prisma/client';
import { DataCity } from 'src/_core/data/city-district';
import { JobCategory } from 'src/_core/data/job-category';
import { hashPassword } from 'src/_core/helper/utils';
const prisma = new PrismaClient();

const main = async () => {
  const password = '12345678';
  const passwordHash = await hashPassword(password);

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
        // districts: {
        //   updateMany: {
        //     where: {
        //       id: { in: city.districts.map((district) => district.id) },
        //     },
        //     data: city.districts.map((district) => {
        //       return {
        //         id: district.id,
        //         name: district.name,
        //       };
        //     }),
        //   },
        // },
      },
      // data: {
      //   id: city.id,
      //   name: city.name,
      //   districts: {
      //     createMany: {
      //       data: city.districts.map((district) => {
      //         return {
      //           id: district.id,
      //           name: district.name,
      //         };
      //       }),
      //     },
      //   },
      // },
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
