import { IsNumber } from 'class-validator';

export class ReadMessageDto {
  @IsNumber()
  conversationId: number;
}
