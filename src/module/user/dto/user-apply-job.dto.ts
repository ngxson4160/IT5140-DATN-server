import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EPublicCVType } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class UserApplyJobDto {
  @IsOptional()
  @IsString()
  candidateCv?: string;

  @IsString()
  candidateName: string;

  @IsString()
  candidateEmail: string;

  @IsString()
  candidatePhoneNumber: string;

  @IsEnum(EPublicCVType)
  @TransformStringToNumber()
  cvType: EPublicCVType;
}
