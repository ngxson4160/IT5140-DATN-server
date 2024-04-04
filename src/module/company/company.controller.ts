import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CompanyUpdateDto } from './dto/update-company.dto';

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

  @Public()
  @Get(':id')
  getCompany(@Param('id') id: string) {
    return this.companyService.getCompany(+id);
  }
}
