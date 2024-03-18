import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DeleteObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import {
  BaseException,
  HttpExceptionFilter,
} from './_core/middleware/filter/exception.filter';
import { MessageResponse } from './_core/constant/message-response.constant';

@Injectable()
export class AppService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 's3-ap-southeast-1.amazonaws.com/pdf',
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File, path: string) {
    const params: PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      // ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return {
        relativePath: s3Response.Key,
        absolutePath: s3Response.Location,
      };
    } catch (e) {
      throw new BaseException(MessageResponse.COMMON.S3_UPLOAD_ERROR);
    }
  }
}
