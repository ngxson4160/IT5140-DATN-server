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
  @IsNumber()
  @Type(() => Number)
  desiredJobCategoryId?: number;

  @IsOptional()
  @IsEnum(EGender)
  gender?: EGender;

  @IsOptional()
  @IsEnum(EJobLevel)
  desiredJobLevel?: EJobLevel;

  @IsOptional()
  @IsEnum(EJobMode)
  desiredJobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EMaritalStatus)
  maritalStatus?: EMaritalStatus;

  @IsOptional()
  @IsEnum(EEducationLevel)
  educationalLevel?: EEducationLevel;
}
