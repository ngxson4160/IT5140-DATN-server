import { Global, Module } from '@nestjs/common';
import { S3Service } from './file-factory/file-S3';
import { LocalFileService } from './file-factory/file-local';
import { FileFactory } from './file-factory/file.factory';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Global()
@Module({
  controllers: [FileController],
  providers: [S3Service, LocalFileService, FileFactory, FileService],
  exports: [S3Service, LocalFileService, FileFactory],
})
export class FileModule {}
