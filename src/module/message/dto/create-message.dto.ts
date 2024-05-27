import { IsNumber, IsOptional, IsString } from 'class-validator';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsNumber()
  @TransformStringToNumber()
  conversationId: number;

  @IsOptional()
  @TransformStringToNumber()
  toUserId?: number;
}
