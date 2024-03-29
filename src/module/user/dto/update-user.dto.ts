import { JsonValue } from '@prisma/client/runtime/library';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
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

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsDate()
  dob: Date;

  @IsEnum(EGender)
  gender: EGender;

  @IsString()
  phoneNumber: string;

  @IsJSON()
  cv: JsonValue;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  city: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  desiredSalary: string;

  @IsString()
  @IsNotEmpty()
  yearExperience: number;
}
