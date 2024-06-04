import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ESort } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListBlogDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  creatorId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  companyId?: number;
}
