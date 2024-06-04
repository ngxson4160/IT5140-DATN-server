import { IsBoolean } from 'class-validator';
export class FollowBlogDto {
  @IsBoolean()
  isFavorite: number;
}
