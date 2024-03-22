// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// const prisma = new PrismaClient();
// const main = async () => {
//   const data = [
//     {
//       id: '76fe5a43-1fd4-4d60-9b4e-60e4debf23ec',
//       name: 'ADMIN',
//     },
//     {
//       id: '311f1506-2c9e-45b1-b839-bb3306f6e0f2',
//       name: 'OPERATOR',
//     },
//     {
//       id: '5b67e5df-0d07-4450-b4ce-1880b7fb8784',
//       name: 'USER',
//     },
//   ];
//   const rolePromise = data.map((el) => {
//     return prisma.role.upsert({
//       where: {
//         id: el.id,
//       },
//       create: el,
//       update: el,
//     });
//   });

//   await Promise.all(rolePromise);

//   const password = 'Admin11111';

//   const passwordHash = await handleBCRYPTHash(password, saltOrRounds);

//   const alice = await prisma.user.upsert({
//     where: { email: 'operator@wanosoft.com' },
//     update: {},
//     create: {
//       email: 'operator@wanosoft.com',
//       userName: 'Alice',
//       firstName: 'Adam',
//       lastName: 'Alice',
//       password: passwordHash,
//       passwordSalt: saltOrRounds,
//       gender: EGender.FEMALE,
//       roleId: data.find((el) => el.name === 'OPERATOR').id,
//     },
//   });
//   const bob = await prisma.user.upsert({
//     where: { email: 'bob@prisma.io' },
//     update: {},
//     create: {
//       email: 'bob@prisma.io',
//       userName: 'Bob',
//       firstName: 'Bob',
//       lastName: 'Jonh',
//       password: passwordHash,
//       passwordSalt: saltOrRounds,
//       gender: EGender.FEMALE,
//       roleId: data.find((el) => el.name === 'USER').id,
//     },
//   });
//   console.log({ alice, bob });

//   //tags seed
//   const dataTags = [
//     {
//       id: '7dd4a19e-fae4-4f48-a562-53f9c9d3e227',
//       name: 'JavaScript',
//       creatorId: bob.id,
//     },
//     {
//       id: '0bf45d65-3c92-4c7f-923c-cf91921b18bc',
//       name: 'Express.js',
//       creatorId: bob.id,
//     },
//     {
//       id: 'cff77a00-884b-4f7c-ba82-b17360be5015',
//       name: 'React',
//       creatorId: bob.id,
//     },
//     {
//       id: '9cdf00e2-9ce8-4fbf-a582-639a6a7b5c60',
//       name: 'Angular',
//       creatorId: bob.id,
//     },
//     {
//       id: '5643270c-4de1-4876-9949-ca0911725b8b',
//       name: 'Vue.js',
//       creatorId: bob.id,
//     },
//     {
//       id: '81412b05-46c1-43a9-af25-8a9fc5f5af50',
//       name: 'MongoDB',
//       creatorId: bob.id,
//     },
//     {
//       id: '46fd4d6b-c920-4a50-858e-33f03efea05f',
//       name: 'PostgreSQL',
//       creatorId: bob.id,
//     },
//     {
//       id: '9c485bd2-c266-4489-b21b-ae22a910b963',
//       name: 'GraphQL',
//       creatorId: bob.id,
//     },
//     {
//       id: 'bf38c3ad-f3cc-4726-940a-6f844df8944e',
//       name: 'Docker',
//       creatorId: bob.id,
//     },
//     {
//       id: '8216c1e3-e3aa-43eb-8c9a-16882f6c03c6',
//       name: 'RESTful API',
//       creatorId: bob.id,
//     },
//     {
//       id: 'e2529fc0-aa37-4c44-bc5e-b5488fb30460',
//       name: 'HTML5',
//       creatorId: bob.id,
//     },
//     {
//       id: 'ea742e84-e79d-4a27-a030-5e187db474a9',
//       name: 'CSS3',
//       creatorId: bob.id,
//     },
//     {
//       id: 'a5df249c-7978-41b2-b8f7-b4135794da87',
//       name: 'Webpack',
//       creatorId: bob.id,
//     },
//     {
//       id: '3f7dae96-5534-436b-b407-cecbc902e721',
//       name: 'Git',
//       creatorId: bob.id,
//     },
//     {
//       id: 'bf82d8c5-bb26-40ee-9416-5cb3ebbc707c',
//       name: 'Java',
//       creatorId: bob.id,
//     },
//     {
//       id: '25f6c5b6-bac1-4a9e-b095-e43226202497',
//       name: 'Python',
//       creatorId: bob.id,
//     },
//     {
//       id: '89ac1b70-58c6-4c18-9173-f8862798594c',
//       name: 'Ruby',
//       creatorId: bob.id,
//     },
//     {
//       id: '4d625f90-bff6-400d-9b62-71f218aac9eb',
//       name: 'C#',
//       creatorId: bob.id,
//     },
//     {
//       id: '8f6b17c8-e524-4aad-b793-3988d536605f',
//       name: 'ChatGPT',
//       creatorId: bob.id,
//     },
//     {
//       id: '1e324fcd-7a7e-43e3-8f78-542b563407fe',
//       name: 'MySQL',
//       creatorId: bob.id,
//     },
//     {
//       id: '17ac4f46-8ce0-424f-b114-863d52d55a89',
//       name: 'SQLServer',
//       creatorId: bob.id,
//     },
//     {
//       id: 'fd33bcbf-a454-4b8d-8722-3fd90e4676dc',
//       name: 'Next',
//       creatorId: bob.id,
//     },
//     {
//       id: 'a81421c4-f956-45b4-a7d3-3a70de72428e',
//       name: 'Nuxt',
//       creatorId: bob.id,
//     },
//     {
//       id: '14624878-39bc-4118-bfc9-d629a0a9b2fa',
//       name: 'Gemini',
//       creatorId: bob.id,
//     },
//     {
//       id: '215f7842-0630-4258-af04-ae4437acfd56',
//       name: 'AWS Bedrock',
//       creatorId: bob.id,
//     },
//     {
//       id: '65050fa0-df89-4609-aa21-3ecd80824cfc',
//       name: 'OpenAI',
//       creatorId: bob.id,
//     },
//     {
//       id: '134c11b2-b384-4378-88bf-980cb0457aff',
//       name: 'AWS',
//       creatorId: bob.id,
//     },
//     {
//       id: '387f9f44-909c-41f3-96f7-a18d2f4d3b3c',
//       name: 'Azure',
//       creatorId: bob.id,
//     },
//     {
//       id: '1ced5248-b6de-4feb-8ad7-65c3bfd7d060',
//       name: 'Google',
//       creatorId: bob.id,
//     },
//     {
//       id: '1d17ed5b-1cc0-4ecf-ae43-cc4843bd3bf1',
//       name: 'Cloud',
//       creatorId: bob.id,
//     },
//   ];

//   const tagsPromise = dataTags.map((tag) => {
//     return prisma.tag.upsert({
//       where: {
//         id: tag.id,
//       },
//       update: tag,
//       create: tag,
//     });
//   });

//   await Promise.all(tagsPromise);
// };

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
