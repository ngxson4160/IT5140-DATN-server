import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ESort } from 'src/_core/constant/enum.constant';
import { TransformStringToNumber } from 'src/_core/decorator/transform-string-to-number.decorator';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class GetListBlogDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ESort)
  sortCreatedAt?: ESort;

  @IsOptional()
  @IsNumber()
  @TransformStringToNumber()
  creatorId?: number;

  @IsOptional()
  @IsNumber()
  @TransformStringToNumber()
  companyId?: number;
}
