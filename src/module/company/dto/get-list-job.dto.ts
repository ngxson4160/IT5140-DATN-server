import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { EJobStatus, ESort } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';
import { EJobType } from 'src/_core/type/common.type';

export class CompanyGetListJobDto extends PaginationDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsEnum(EJobStatus)
  @Type(() => Number)
  status?: EJobStatus;

  @IsOptional()
  @IsEnum(EJobType)
  @Type(() => Number)
  type?: EJobType;

  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;
}
