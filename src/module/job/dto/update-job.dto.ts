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

  @IsEnum(EJobMode)
  jobMode: EJobMode;

  @IsEnum(EJobLevel)
  level: EJobLevel;

  @IsString()
  officeName: string;

  @IsArray()
  address: JsonValue;

  @IsNumber()
  quantity: number;

  @IsEnum(EJobStatus)
  status: EJobStatus;

  @IsOptional()
  @IsString()
  time: string;

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
  yearExperience: number;

  @IsDateString()
  hiringStartDate: Date;

  @IsDateString()
  hiringEndDate: Date;
}
