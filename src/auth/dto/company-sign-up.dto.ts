import { IsNumber, IsString } from 'class-validator';
import { UserSignUpDto } from './sign-up.dto';

export class CompanyInformationSignUpDto {
  @IsString()
  name: string;

  @IsNumber()
  totalStaff: number;

  @IsNumber()
  averageAge: number;

  @IsString()
  primaryCity: string;

  @IsString()
  primaryAddress: string;

  @IsNumber()
  jobCategoryParentId: number;
}

export class CompanySignUpDto {
  user: UserSignUpDto;
  company: CompanyInformationSignUpDto;
}
