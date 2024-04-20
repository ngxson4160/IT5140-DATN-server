import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';
import { EJobLevel, EWorkMode } from 'src/_core/constant/enum.constant';
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
  @IsNumber()
  @Type(() => Number)
  salary?: number;

  @IsOptional()
  @IsEnum(EWorkMode)
  //   @IsArray()
  //   @IsNumber({}, {each: true})
  workMode?: EWorkMode;

  @IsOptional()
  @IsEnum(EJobLevel)
  //   @IsArray()
  //   @IsNumber({}, {each: true})
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
}
