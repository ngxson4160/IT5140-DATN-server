import { JsonValue } from '@prisma/client/runtime/library';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { EGender } from 'src/_core/constant/enum.constant';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lastName: string;

  @IsString()
  avatar: string;

  @IsDateString()
  dob: Date;

  @IsEnum(EGender)
  gender: EGender;

  @IsString()
  phoneNumber: string;

  @IsArray()
  cv: JsonValue;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  city: string;

  @IsNumber()
  desiredSalary: number;

  @IsNumber()
  yearExperience: number;
}
