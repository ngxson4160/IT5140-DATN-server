import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV } from '../config/env.config';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.get(ENV.AWS_BUCKET_REGION),
    credentials: {
      accessKeyId: this.configService.get(ENV.AWS_ACCESS_KEY),
      secretAccessKey: this.configService.get(ENV.AWS_SECRET_ACCESS_KEY),
    },
    endpoint: 's3-ap-southeast-1.amazonaws.com/pdf',
  });
  // constructor() {}

  async upload(file: Express.Multer.File, fileName: string) {
    console.log(file);
    try {
      const fileUpload = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get(ENV.AWS_BUCKET_NAME),
          Key: fileName,
          Body: file.buffer,
        }),
      );
      return fileUpload;
    } catch (error) {
      console.log(error);
    }
  }
}
