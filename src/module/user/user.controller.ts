import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/_core/file-system/s3';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  createUser() {
    return this.userService.createUser();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  test(@UploadedFile() file: Express.Multer.File) {
    return this.s3Service.upload(file, file.originalname);
  }
}
