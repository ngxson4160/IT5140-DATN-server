import { IsNumber, IsOptional } from 'class-validator';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetMessageConversation extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @TransformStringToNumber()
  cursor?: number;
}
