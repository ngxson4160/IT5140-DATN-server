import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ENotificationStatus } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class UpdateManyNotificationDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(ENotificationStatus)
  @TransformStringToNumber()
  status?: ENotificationStatus;
}
