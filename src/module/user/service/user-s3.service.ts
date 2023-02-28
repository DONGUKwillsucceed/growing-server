import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/service/S3.service';
import { UserCoupleInterface } from '../types/User.interface';

@Injectable()
export class UserS3Service {
  constructor(private readonly s3Service: S3Service) {}

  async getImageUrl(user: UserCoupleInterface) {
    let imageUrl: string | null = null;
    if (user.Photos_PhotosToUsers_profileId) {
      imageUrl = await this.s3Service.getObjectUrl(
        new URL(user.Photos_PhotosToUsers_profileId.s3Path),
      );
    }

    return { imageUrl, ...user };
  }
}
