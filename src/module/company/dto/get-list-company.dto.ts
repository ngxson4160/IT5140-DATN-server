import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ESort } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListCompanyDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;
}
