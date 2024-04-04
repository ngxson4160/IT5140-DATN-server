import { JsonValue } from '@prisma/client/runtime/library';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CompanyUpdateDto {
  @IsNumber()
  jobCategoryParentId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  extraEmail?: JsonValue;

  @IsOptional()
  @IsString()
  aboutUs?: string;

  @IsString()
  avatar: string;

  @IsString()
  coverImage: string;

  @IsOptional()
  @IsString()
  homePage?: string;

  @IsOptional()
  @IsObject()
  socialMedia?: JsonValue;

  @IsNumber()
  totalStaff: number;

  @IsNumber()
  averageAge: number;

  @IsString()
  primaryCity: string;

  @IsOptional()
  @IsArray()
  extraCity?: JsonValue;

  @IsString()
  primaryAddress: string;

  @IsOptional()
  @IsArray()
  extraAddress?: JsonValue;

  @IsString()
  primaryPhoneNumber: string;

  @IsOptional()
  @IsArray()
  extraPhoneNumber?: JsonValue;
}
