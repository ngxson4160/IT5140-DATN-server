import { Controller, Get } from '@nestjs/common';
import { JobCategoryParentService } from './job-category-parent.service';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('job-category-parents')
export class JobCategoryParentController {
  constructor(private readonly jobCategoryParent: JobCategoryParentService) {}

  @Public()
  @Get()
  async getListJobCategoryParents() {
    return this.jobCategoryParent.getListJobCategoryParents();
  }
}
