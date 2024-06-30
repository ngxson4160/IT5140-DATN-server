import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { EApplicationStatus } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListApplicationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EApplicationStatus)
  @TransformStringToNumber()
  status?: EApplicationStatus;
}
