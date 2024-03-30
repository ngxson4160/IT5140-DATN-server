import { IsEmail, IsString, MinLength } from 'class-validator';
import { MessageResponse } from 'src/_core/constant/message-response.constant';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, MessageResponse.COMMON.MIN_LENGTH_8)
  password: string;
}
