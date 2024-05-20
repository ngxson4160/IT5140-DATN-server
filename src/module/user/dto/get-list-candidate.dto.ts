import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  EEducationLevel,
  EGender,
  EJobLevel,
  EJobMode,
  EMaritalStatus,
} from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListCandidateDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cityId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearExperienceMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearExperienceMax?: number;

  @IsOptional()
  desiredJobCategoryIds?: string;

  @IsOptional()
  @IsEnum(EGender)
  @Type(() => Number)
  gender?: EGender;

  @IsOptional()
  @IsEnum(EJobLevel)
  @Type(() => Number)
  desiredJobLevel?: EJobLevel;

  @IsOptional()
  @IsEnum(EJobMode)
  @Type(() => Number)
  desiredJobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EMaritalStatus)
  @Type(() => Number)
  maritalStatus?: EMaritalStatus;

  @IsOptional()
  @IsEnum(EEducationLevel)
  @Type(() => Number)
  educationalLevel?: EEducationLevel;
}
