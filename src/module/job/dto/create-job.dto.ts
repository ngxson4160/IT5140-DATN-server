import { JsonValue } from '@prisma/client/runtime/library';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  EGender,
  EJobStatus,
  EWorkMode,
} from 'src/_core/constant/enum.constant';

export class CreateJobDto {
  @IsNumber()
  jobCategoryId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  cityIds: number[];

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
  address: JsonValue;

  @IsNumber()
  quantity: number;

  @IsEnum(EJobStatus)
  status: EJobStatus;

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
