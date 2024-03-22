import { Global, Module } from '@nestjs/common';
import { S3Service } from './file-S3';
import { LocalFileService } from './file-local';
import { FileFactory } from './file.factory';

@Global()
@Module({
  providers: [S3Service, LocalFileService, FileFactory],
  exports: [S3Service, LocalFileService, FileFactory],
})
export class FileSystemModule {}
