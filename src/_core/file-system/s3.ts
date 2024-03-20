import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { error } from 'console';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: 's3-ap-southeast-1.amazonaws.com/pdf',
  });
  // constructor() {}

  async upload(file: Express.Multer.File, fileName: string) {
    console.log(file);
    try {
      const fileUpload = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
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
