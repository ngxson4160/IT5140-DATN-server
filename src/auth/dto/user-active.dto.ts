import { IsEmail, IsString } from 'class-validator';

export class UserActiveDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
