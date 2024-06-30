import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  EEducationLevel,
  EGender,
  EJobLevel,
  EJobMode,
  EMaritalStatus,
  EYearExperience,
} from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListCandidateDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @TransformStringToNumber()
  cityId?: number;

  // @IsOptional()
  // @IsNumber()
  // @Type(() => Number)
  // yearExperienceMin?: number;

  // @IsOptional()
  // @IsNumber()
  // @Type(() => Number)
  // yearExperienceMax?: number;

  @IsOptional()
  @IsEnum(EYearExperience)
  @TransformStringToNumber()
  yearExperience?: EYearExperience;

  @IsOptional()
  desiredJobCategoryIds?: string;

  @IsOptional()
  @IsEnum(EGender)
  // @Type(() => Number)
  @TransformStringToNumber()
  gender?: EGender;

  @IsOptional()
  @IsEnum(EJobLevel)
  // @Type(() => Number)
  @TransformStringToNumber()
  desiredJobLevel?: EJobLevel;

  @IsOptional()
  @IsEnum(EJobMode)
  // @Type(() => Number)
  @TransformStringToNumber()
  desiredJobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EMaritalStatus)
  // @Type(() => Number)
  @TransformStringToNumber()
  maritalStatus?: EMaritalStatus;

  @IsOptional()
  @IsEnum(EEducationLevel)
  // @Type(() => Number)
  @TransformStringToNumber()
  educationalLevel?: EEducationLevel;
}
