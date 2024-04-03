import { IsNumber, IsString } from 'class-validator';
import { UserSignUpDto } from './sign-up.dto';

export class CompanyInformationSignUpDto {
  @IsNumber()
  jobCategoryParentId: number;

  @IsString()
  name: string;

  @IsString()
  avatar: string;

  @IsString()
  coverImage: string;

  @IsNumber()
  totalStaff: number;

  @IsNumber()
  averageAge: number;

  @IsString()
  primaryCity: string;

  @IsString()
  primaryAddress: string;

  @IsString()
  primaryPhoneNumber: string;
}

export class CompanySignUpDto {
  user: UserSignUpDto;
  company: CompanyInformationSignUpDto;
}
