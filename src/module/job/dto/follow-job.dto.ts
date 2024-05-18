import { IsBoolean } from 'class-validator';
export class FollowJobDto {
  @IsBoolean()
  isFavorite: number;
}
