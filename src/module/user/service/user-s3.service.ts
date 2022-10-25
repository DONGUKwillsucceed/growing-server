import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/service/S3.service';
import { UserCoupleInterface } from '../types/User.interface';

@Injectable()
export class UserS3Service {
  constructor(private readonly s3Service: S3Service) {}

  async getImageUrl(user: UserCoupleInterface) {
    let imageUrl: string | null = null;
    if (user.profileImageS3Path) {
      imageUrl = await this.s3Service.getObjectUrl(
        new URL(user.profileImageS3Path),
      );
    }

    return { imageUrl, ...user };
  }
}
