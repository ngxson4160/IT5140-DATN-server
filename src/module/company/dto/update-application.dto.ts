import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  EApplicationClassify,
  EApplicationStatus,
} from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class ApplicationUpdateDto {
  @IsOptional()
  @IsEnum(EApplicationStatus)
  @TransformStringToNumber()
  status: EApplicationStatus;

  @IsOptional()
  @IsDateString()
  interviewSchedule: string;

  @IsOptional()
  @IsString()
  companyRemark: string;

  @IsOptional()
  @IsEnum(EApplicationClassify)
  @TransformStringToNumber()
  classify: EApplicationClassify;
}
