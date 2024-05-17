import { Type } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { EPublicCVType } from 'src/_core/constant/enum.constant';

export class UserApplyJobDto {
  @IsString()
  candidateCv: string;

  @IsString()
  candidateFirstName: string;

  @IsString()
  candidateLastName: string;

  @IsString()
  candidateEmail: string;

  @IsString()
  candidatePhoneNumber: string;

  @IsEnum(EPublicCVType)
  @Type(() => Number)
  cvType: EPublicCVType;
}
