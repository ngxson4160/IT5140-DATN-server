import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  EApplicationClassify,
  EApplicationStatus,
  ESort,
} from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListCandidateDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  jobId?: number;

  @IsOptional()
  @IsEnum(EApplicationStatus)
  @Type(() => Number)
  status?: EApplicationStatus;

  @IsOptional()
  @IsEnum(EApplicationClassify)
  @Type(() => Number)
  classify?: EApplicationClassify;

  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;
}
