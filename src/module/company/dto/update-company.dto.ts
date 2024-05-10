import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ECompanySizeType } from 'src/_core/constant/enum.constant';

export class CompanyUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  primaryEmail: string;

  @IsOptional()
  @IsString()
  taxCode: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  jobCategoryParentId: number;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ECompanySizeType)
  sizeType: ECompanySizeType;

  @IsOptional()
  @IsString()
  primaryAddress: string;

  @IsOptional()
  @IsString()
  primaryPhoneNumber: string;

  @IsOptional()
  @IsString()
  aboutUs: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  coverImage: string;
}
