import { IsEnum, IsNumber, IsString } from 'class-validator';
import { UserSignUpDto } from './sign-up.dto';
import { Transform, Type } from 'class-transformer';
import { ECompanySizeType } from 'src/_core/constant/enum.constant';

export class CompanyInformationSignUpDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  jobCategoryParentId: number;

  @IsString()
  primaryPhoneNumber: string;

  @IsString()
  primaryAddress: string;

  @IsEnum(ECompanySizeType)
  sizeType: ECompanySizeType;

  // @IsNumber()
  // @Type(() => Number)
  // cityId: number;
}
export class CompanySignUpDto {
  user: UserSignUpDto;
  company: CompanyInformationSignUpDto;
}
