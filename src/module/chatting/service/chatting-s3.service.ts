import { S3Service } from 'src/service/S3.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChattingS3Service {
  constructor(private readonly s3Service: S3Service) {}

  async getSignedUrls(s3Paths: string[]) {
    const imageUrls: string[] = [];
    for (const url of s3Paths) {
      const signedUrl = await this.s3Service.getObjectUrl(new URL(url));
      imageUrls.push(signedUrl);
    }
    return imageUrls;
  }

  async getSingedUrl(s3Path: string) {
    return await this.s3Service.getObjectUrl(new URL(s3Path));
  }
}
