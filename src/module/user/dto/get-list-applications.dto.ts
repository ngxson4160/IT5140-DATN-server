import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { EApplicationStatus } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListApplicationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EApplicationStatus)
  @Type(() => Number)
  status?: EApplicationStatus;
}