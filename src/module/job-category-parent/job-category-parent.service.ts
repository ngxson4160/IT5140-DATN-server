import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobCategoryParentService {
  constructor(private readonly prisma: PrismaService) {}

  async getListJobCategoryParents() {
    const listJobCategoryParents = await this.prisma.jobCategoryParent.findMany(
      {
        select: {
          id: true,
          name: true,
          jobCategories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    );

    return listJobCategoryParents;
  }
}
