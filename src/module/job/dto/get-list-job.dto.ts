import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsArray, IsString } from 'class-validator';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

// TODO Validate
export class GetListJobDto extends PaginationDto {
  @IsOptional()
  // @IsArray()
  // @Type(() => Number)
  // @IsNumber({}, { each: true })
  jobCategoryIds?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salary?: number;

  @IsOptional()
  //   @IsArray()
  //   @IsNumber({}, {each: true})
  workMode?: number[];

  @IsOptional()
  //   @IsNumber()
  cities?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  workExperience?: number;

  @IsOptional()
  @IsString()
  position?: string;
}
