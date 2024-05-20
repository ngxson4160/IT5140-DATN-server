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
  EJobLevel,
  EJobMode,
} from 'src/_core/constant/enum.constant';

export class UpdateJobDto {
  @IsOptional()
  @IsNumber()
  jobCategoryId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  cityIds: number[];

  @IsOptional()
  @IsString()
  title: string;

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

  @IsOptional()
  @IsEnum(EJobMode)
  jobMode: EJobMode;

  @IsOptional()
  @IsEnum(EJobLevel)
  level: EJobLevel;

  @IsOptional()
  @IsString()
  officeName: string;

  @IsOptional()
  @IsArray()
  address: JsonValue;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsEnum(EJobStatus)
  status: EJobStatus;

  @IsOptional()
  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  benefits: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  requirement: string;

  @IsOptional()
  @IsEnum(EGender)
  gender: EGender;

  @IsOptional()
  @IsNumber()
  yearExperience: number;

  @IsOptional()
  @IsDateString()
  hiringStartDate: Date;

  @IsOptional()
  @IsDateString()
  hiringEndDate: Date;
}
