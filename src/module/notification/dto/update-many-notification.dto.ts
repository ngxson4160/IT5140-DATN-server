import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ENotificationStatus } from 'src/_core/constant/enum.constant';

export class UpdateManyNotificationDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(ENotificationStatus)
  status?: ENotificationStatus;
}
