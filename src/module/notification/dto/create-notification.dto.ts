import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ENotificationType } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class CreateNotificationDto {
  @IsNumber()
  @TransformStringToNumber()
  fromUserId: number;

  @IsNumber()
  @TransformStringToNumber()
  toUserId: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(ENotificationType)
  @TransformStringToNumber()
  type?: ENotificationType;
}
