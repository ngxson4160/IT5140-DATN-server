import { JsonValue } from '@prisma/client/runtime/library';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EGender, ETypeJob, EWorkMode } from 'src/_core/constant/enum.constant';

export class UpdateJobDto {
  @IsNumber()
  jobCategoryId: number;

  @IsString()
  title: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsNumber()
  salaryMin: number;

  @IsOptional()
  @IsNumber()
  salaryMax: number;

  @IsOptional()
  @IsArray()
  images: JsonValue;

  @IsOptional()
  @IsNumber()
  hours: number;

  @IsEnum(EWorkMode)
  workMode: EWorkMode;

  @IsString()
  officeName: string;

  @IsArray()
  city: JsonValue;

  @IsArray()
  address: JsonValue;

  @IsNumber()
  quantity: number;

  @IsEnum(ETypeJob)
  type: ETypeJob;

  //   @IsNumber()
  //   totalViews: number;

  //   @IsNumber()
  //   totalCandidate: number;

  @IsString()
  benefits: string;

  @IsString()
  description: string;

  @IsString()
  requirement: string;

  @IsOptional()
  @IsEnum(EGender)
  gender: EGender;

  @IsOptional()
  @IsNumber()
  yearExperienceMin: number;

  @IsOptional()
  @IsNumber()
  yearExperienceMax: number;

  @IsDateString()
  hiringStartDate: Date;

  @IsDateString()
  hiringEndDate: Date;
}
