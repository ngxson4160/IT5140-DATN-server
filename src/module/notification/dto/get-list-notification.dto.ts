import { IsEnum, IsOptional } from 'class-validator';
import { ESort } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListNotificationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;
}
