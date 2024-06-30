import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ECompanySizeType } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

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
  @TransformStringToNumber()
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
