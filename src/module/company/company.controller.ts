import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CompanyUpdateDto } from './dto/update-company.dto';
import { ApplicationUpdateDto } from './dto/update-application.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('my-company')
  getMyCompany(@UserData() userData: IUserData) {
    return this.companyService.getMyCompany(userData.id);
  }

  @Put('my-company')
  updateMyCompany(
    @UserData() userData: IUserData,
    @Body() body: CompanyUpdateDto,
  ) {
    return this.companyService.updateCompany(userData.id, body);
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

  @Public()
  @Get(':id')
  getCompany(@Param('id') id: string) {
    return this.companyService.getCompany(+id);
  }
}
