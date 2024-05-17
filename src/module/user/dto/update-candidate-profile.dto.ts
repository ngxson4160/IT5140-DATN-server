import { JsonValue } from '@prisma/client/runtime/library';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  EEducationLevel,
  EGender,
  EJobLevel,
  EJobMode,
  EMaritalStatus,
  EPublicCVType,
} from 'src/_core/constant/enum.constant';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsOptional()
  @IsNumber()
  districtId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsEnum(EGender)
  gender?: EGender;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(EMaritalStatus)
  maritalStatus?: EMaritalStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(EEducationLevel)
  educationalLevel: EEducationLevel;

  //candidate information
  @IsOptional()
  @IsString()
  target?: string;

  @IsOptional()
  @IsNumber()
  desiredJobCategoryId?: number;

  @IsOptional()
  @IsNumber()
  desiredCityId?: number;

  @IsOptional()
  @IsArray()
  cv?: JsonValue;

  @IsOptional()
  @IsNumber()
  yearExperience?: number;

  @IsOptional()
  @IsArray()
  workExperience?: JsonValue;

  @IsOptional()
  @IsArray()
  education?: JsonValue;

  @IsOptional()
  @IsArray()
  certificate?: JsonValue;

  @IsOptional()
  @IsArray()
  advancedSkill?: JsonValue;

  @IsOptional()
  @IsArray()
  languageSkill?: JsonValue;

  @IsOptional()
  @IsArray()
  project?: JsonValue;

  @IsOptional()
  @IsNumber()
  desiredSalary?: number;

  @IsOptional()
  @IsEnum(EJobLevel)
  desiredJobLevel?: EJobLevel;

  @IsOptional()
  @IsEnum(EJobMode)
  desiredJobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EPublicCVType)
  publicCvType?: EPublicCVType;

  @IsOptional()
  @IsString()
  publicAttachmentCv?: string;
}
