import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import {
  EApplicationStatus,
  EJobStatus,
} from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListApplicationJobDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EApplicationStatus)
  @Type(() => Number)
  status?: EApplicationStatus;
}
