import { Injectable } from '@nestjs/common';
import { S3Service } from './file-S3';
import { LocalFileService } from './file-local';
import { IFileService } from './file.interface';
import { FileType } from '../enum/file-type';

@Injectable()
export class FileFactory {
  constructor(
    private readonly s3Service: S3Service,
    private readonly localFileService: LocalFileService,
  ) {}

  getFile(typeFileProcess: string): IFileService {
    if (typeFileProcess === FileType.S3) {
      return this.s3Service;
    } else if (typeFileProcess === FileType.LOCAL) {
      return this.localFileService;
    }

    return null;
  }
}
