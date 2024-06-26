import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileService } from './file.interface';
import * as path from 'path';
import * as crypto from 'crypto';
import { ENV } from 'src/_core/config/env.config';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { ES3Path } from '../enum/S3-path';

@Injectable()
export class S3Service implements IFileService {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.get(ENV.AWS_BUCKET_REGION),
    credentials: {
      accessKeyId: this.configService.get(ENV.AWS_ACCESS_KEY),
      secretAccessKey: this.configService.get(ENV.AWS_SECRET_ACCESS_KEY),
    },
  });

  async uploadFile(file: Express.Multer.File, pathFile?: ES3Path) {
    const pathFileUploadToS3 = pathFile ? `${pathFile}/` : '';

    const keyHash = crypto.randomBytes(64).toString('hex');
    const extname = path.extname(file.originalname);
    const key = `${pathFileUploadToS3}${keyHash}${extname}`;
    const baseName = path.basename(file.originalname, extname);

    const createParams: PutObjectCommandInput = {
      Bucket: this.configService.get(ENV.AWS_BUCKET_NAME),
      Key: key,
      Body: file.buffer,
      ContentType:
        pathFile === ES3Path.Pdf
          ? 'application/pdf'
          : 'application/octet-stream',
    };

    try {
      await this.s3Client.send(new PutObjectCommand(createParams));

      const absolutePath = `https://${this.configService.get(
        ENV.AWS_BUCKET_NAME,
      )}.s3.amazonaws.com/${key}`;

      return {
        baseName,
        originalname: file.originalname,
        relativePath: key,
        absolutePath: absolutePath,
      };
    } catch (e) {
      console.log(e);
      throw new CommonException(MessageResponse.COMMON.S3_UPLOAD_ERROR);
    }
  }

  async deleteFile(path: string): Promise<void> {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: this.configService.get(ENV.AWS_BUCKET_NAME),
      Key: path,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (e) {
      console.log(e);
      throw new CommonException(MessageResponse.COMMON.S3_DELETE_ERROR);
    }
  }

  async deleteFolder(path: string): Promise<void> {
    return;
  }

  copy(oldPath: string, newPath: string, cb: (...args: any[]) => any): void {
    return;
  }
}
