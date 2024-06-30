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
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

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
  @TransformStringToNumber()
  gender?: EGender;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(EMaritalStatus)
  @TransformStringToNumber()
  maritalStatus?: EMaritalStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(EEducationLevel)
  @TransformStringToNumber()
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
  @TransformStringToNumber()
  desiredJobLevel?: EJobLevel;

  @IsOptional()
  @IsEnum(EJobMode)
  @TransformStringToNumber()
  desiredJobMode?: EJobMode;

  @IsOptional()
  @IsEnum(EPublicCVType)
  @TransformStringToNumber()
  publicCvType?: EPublicCVType;

  @IsOptional()
  @IsString()
  publicAttachmentCv?: string;
}
