import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { ES3Path } from './enum/S3-path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('images')
  @UseInterceptors(FileInterceptor('file'))
  uploadImagesToS3(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadToS3(file, ES3Path.Image);
  }

  @Post('pdfs')
  @UseInterceptors(FileInterceptor('file'))
  uploadPdfsToS3(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadToS3(file, ES3Path.Pdf);
  }
}
