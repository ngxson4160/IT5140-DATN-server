import { IsDateString } from 'class-validator';

export class ReopenJobDto {
  @IsDateString()
  hiringEndDate: Date;
}
