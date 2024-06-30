import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import {
  EApplicationClassify,
  EApplicationStatus,
} from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListApplicationJobDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EApplicationStatus)
  @TransformStringToNumber()
  status?: EApplicationStatus;

  @IsOptional()
  @IsEnum(EApplicationClassify)
  @TransformStringToNumber()
  classify?: EApplicationClassify;
}
