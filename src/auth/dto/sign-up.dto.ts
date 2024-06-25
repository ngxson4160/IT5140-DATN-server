import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { EGender, EYearExperience } from 'src/_core/constant/enum.constant';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(8, MessageResponse.COMMON.MIN_LENGTH_8)
  password: string;

  @IsEnum(EYearExperience)
  @TransformStringToNumber()
  yearExperience: EYearExperience;

  @IsNumber()
  @TransformStringToNumber()
  desiredJobCategoryId: number;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsEnum(EGender)
  gender?: EGender;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
