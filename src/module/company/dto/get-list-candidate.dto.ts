import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  EApplicationClassify,
  EApplicationStatus,
  ESort,
} from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
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
  @TransformStringToNumber()
  status?: EApplicationStatus;

  @IsOptional()
  @IsEnum(EApplicationClassify)
  @TransformStringToNumber()
  classify?: EApplicationClassify;

  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;

  @IsOptional()
  @IsEnum(ESort)
  sortInterviewSchedule?: ESort;
}
