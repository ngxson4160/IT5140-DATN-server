import { IsString, MinLength } from 'class-validator';
import { MessageResponse } from 'src/_core/constant/message-response.constant';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, MessageResponse.COMMON.MIN_LENGTH_8)
  oldPassword: string;

  @IsString()
  @MinLength(8, MessageResponse.COMMON.MIN_LENGTH_8)
  newPassword: string;
}
