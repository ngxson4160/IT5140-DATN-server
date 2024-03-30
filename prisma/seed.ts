import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'src/_core/helper/utils';
const prisma = new PrismaClient();

const main = async () => {
  const password = 'Admin@12345';
  const passwordHash = await hashPassword(password);

  //** USER */
  const users = [
    {
      id: 1,
      email: 'admin@gmail.com',
      firstName: 'Root',
      lastName: 'Admin',
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
      name: 'ENTERPRISE',
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

  //** PERMISSION */
  const permissions = [
    //AppController
    {
      id: 1,
      action: 'AppController.getHello',
    },

    //AuthController
    {
      id: 2,
      action: 'AuthController.userSignUp',
    },
    {
      id: 3,
      action: 'AuthController.userSignIn',
    },
    {
      id: 4,
      action: 'AuthController.userVerify',
    },
    {
      id: 5,
      action: 'AuthController.changePassword',
    },

    //FileController
    {
      id: 7,
      action: 'FileController.uploadImagesToS3',
    },
    {
      id: 8,
      action: 'FileController.uploadPdfsToS3',
    },

    //UserController
    {
      id: 9,
      action: 'UserController.updateUser',
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

  //** USER - ROLE */
  const userRoles = [
    {
      userId: 1,
      roleId: 1,
    },
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
      permissionId: 6,
    },
    {
      roleId: 4,
      permissionId: 7,
    },
    {
      roleId: 4,
      permissionId: 8,
    },
    {
      roleId: 4,
      permissionId: 9,
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
