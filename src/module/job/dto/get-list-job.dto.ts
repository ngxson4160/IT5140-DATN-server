import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import {
  EJobLevel,
  EJobMode,
  ESort,
  EYearExperience,
} from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
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
  @TransformStringToNumber()
  jobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EJobLevel)
  @TransformStringToNumber()
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
  @IsEnum(EYearExperience)
  @TransformStringToNumber()
  yearExperience: EYearExperience;

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
  @TransformStringToNumber()
  companyId: number;

  @IsOptional()
  @IsEnum(ESort)
  sortHiringStartDate?: ESort;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  all?: boolean;
}
