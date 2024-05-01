import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EApplicationStatus } from 'src/_core/constant/enum.constant';
import { PaginationDto } from 'src/_core/dto/query-paging.dto';

export class UserApplyJobDto {
  @IsString()
  candidateCv: string;

  @IsString()
  candidateFirstName: string;

  @IsString()
  candidateLastName: string;

  @IsString()
  candidateEmail: string;

  @IsString()
  candidatePhoneNumber: string;
}
