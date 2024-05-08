import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { EJobLevel, EJobMode, ESort } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

// TODO Validate
export class GetListJobDto extends PaginationDto {
  @IsOptional()
  // @IsArray()
  // @Type(() => Number)
  // @IsNumber({}, { each: true })
  jobCategoryIds?: string;

  @IsOptional()
  //   @IsNumber()
  cityIds?: string;

  @IsOptional()
  // @IsArray()
  // @Type(() => Number)
  // @IsNumber({}, { each: true })
  tagIds?: string;

  @IsOptional()
  @IsEnum(EJobMode)
  //   @IsArray()
  //   @IsNumber({}, {each: true})
  @Type(() => Number)
  jobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EJobLevel)
  //   @IsArray()
  //   @IsNumber({}, {each: true})
  @Type(() => Number)
  level?: EJobLevel;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearExperienceMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearExperienceMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salaryMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  companyId: number;

  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  all?: boolean;
}
