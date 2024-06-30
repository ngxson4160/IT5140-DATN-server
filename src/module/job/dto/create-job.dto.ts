import { JsonValue } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

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

  @IsOptional()
  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  time: string;

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
  @TransformStringToNumber()
  jobMode: EJobMode;

  @IsEnum(EJobLevel)
  @TransformStringToNumber()
  level: EJobLevel;

  @IsOptional()
  @IsString()
  officeName: string;

  @IsArray()
  address: JsonValue;

  @IsNumber()
  quantity: number;

  @IsEnum(EJobStatus)
  @TransformStringToNumber()
  status: EJobStatus;

  @IsString()
  benefits: string;

  @IsString()
  description: string;

  @IsString()
  requirement: string;

  @IsOptional()
  @TransformStringToNumber()
  @IsEnum(EGender)
  gender: EGender;

  @IsNumber()
  @Type(() => Number)
  yearExperience?: number;

  @IsDateString()
  hiringStartDate: Date;

  @IsDateString()
  hiringEndDate: Date;

  @IsOptional()
  @IsBoolean()
  allowNotification: boolean;
}
