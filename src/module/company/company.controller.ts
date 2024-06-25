import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CompanyUpdateDto } from './dto/update-company.dto';
import { ApplicationUpdateDto } from './dto/update-application.dto';
import { CompanyGetListJobDto } from './dto/get-list-job.dto';
import { GetListApplicationJobDto } from './dto/get-list-application.dto';
import { GetListCandidateDto } from './dto/get-list-candidate.dto';
import { GetListCompanyDto } from './dto/get-list-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Public()
  @Get()
  getListCompany(@Query() query: GetListCompanyDto) {
    return this.companyService.getListCompany(query);
  }

  @Get('my-company')
  getMyCompany(@UserData() userData: IUserData) {
    return this.companyService.getMyCompany(userData.id);
  }

  @Get('jobs')
  getListJob(
    @UserData() userData: IUserData,
    @Query() query: CompanyGetListJobDto,
  ) {
    return this.companyService.getListJob(userData.id, query);
  }

  @Put('my-company')
  updateMyCompany(
    @UserData() userData: IUserData,
    @Body() body: CompanyUpdateDto,
  ) {
    return this.companyService.updateCompany(userData.id, body);
  }

  @Post('candidates/:id/view-profile')
  companyViewProfileCandidate(
    @UserData() userData: IUserData,
    @Param('id') candidateId: string,
  ) {
    return this.companyService.companyViewProfileCandidate(
      userData.id,
      +candidateId,
    );
  }

  @Put('jobs/:jobId/applications/:applicationId')
  updateJobApplication(
    @UserData() userData: IUserData,
    @Param('jobId') jobId: string,
    @Param('applicationId') applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto,
  ) {
    return this.companyService.updateJobApplication(
      userData.id,
      +jobId,
      +applicationId,
      applicationUpdateDto,
    );
  }

  // @Get('jobs/:jobId/applications')
  // getJobsApplication(
  //   @UserData() userData: IUserData,
  //   @Param('jobId') jobId: string,
  //   @Query() query: GetListApplicationJobDto,
  // ) {
  //   return this.companyService.getJobsApplication(userData.id, +jobId, query);
  // }

  @Get('candidates')
  getListCandidate(
    @UserData() userData: IUserData,
    @Query() query: GetListCandidateDto,
  ) {
    return this.companyService.getListCandidate(userData.id, query);
  }

  @Public()
  @Get(':id')
  getCompany(@Param('id') id: string) {
    return this.companyService.getCompany(+id);
  }
}
