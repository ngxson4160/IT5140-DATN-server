import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EConversationType } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class CreateConversationDto {
  @IsNumber()
  @TransformStringToNumber()
  withUserId: number;
}
