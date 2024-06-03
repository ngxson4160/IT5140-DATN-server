import { IsDateString } from 'class-validator';

export class ReopenJobDto {
  @IsDateString()
  hiringStartDate: Date;

  @IsDateString()
  hiringEndDate: Date;
}
