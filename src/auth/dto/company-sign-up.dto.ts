import { IsNumber, IsString } from 'class-validator';
import { UserSignUpDto } from './sign-up.dto';
import { Transform, Type } from 'class-transformer';

export class CompanyInformationSignUpDto {
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return Number(value);
  })
  jobCategoryParentId: number;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return Number(value);
  })
  cityId: number;

  @IsString()
  name: string;

  @IsString()
  avatar: string;

  @IsString()
  coverImage: string;

  @IsNumber()
  sizeType: number;

  @IsNumber()
  averageAge: number;

  @IsString()
  primaryAddress: string;

  @IsString()
  primaryPhoneNumber: string;
}

export class CompanySignUpDto {
  user: UserSignUpDto;
  company: CompanyInformationSignUpDto;
}
