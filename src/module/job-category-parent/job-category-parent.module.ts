import { Module } from '@nestjs/common';
import { JobCategoryParentController } from './job-category-parent.controller';
import { JobCategoryParentService } from './job-category-parent.service';

@Module({
  controllers: [JobCategoryParentController],
  providers: [JobCategoryParentService],
})
export class JobCategoryParentModule {}
