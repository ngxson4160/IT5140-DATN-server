import { IsNumber, IsString } from 'class-validator';
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
}
