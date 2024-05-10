import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EApplicationStatus, ESort } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListCandidateDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  jobId?: number;

  @IsOptional()
  @IsEnum(EApplicationStatus)
  @Type(() => Number)
  status?: EApplicationStatus;

  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;
}
