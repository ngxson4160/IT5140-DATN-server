import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EOrderPaging } from '../type/order-paging.type';
import { Type } from 'class-transformer';

//TODO Why is using default value an error?
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  // @IsOptional()
  // @IsNumber()
  // @Type(() => Number)
  // skip = (this.page - 1) * this.take;

  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsEnum(EOrderPaging)
  order?: EOrderPaging;
}
