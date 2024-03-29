import { Injectable } from '@nestjs/common';
import { FileFactory } from './file-factory/file.factory';
import { FileType } from './enum/file-type';

@Injectable()
export class FileService {
  private s3File = this.fileFactory.getFile(FileType.S3);

  constructor(private readonly fileFactory: FileFactory) {}

  uploadToS3(file: Express.Multer.File, path: string) {
    this.s3File.uploadFile(file, path);
  }
}
