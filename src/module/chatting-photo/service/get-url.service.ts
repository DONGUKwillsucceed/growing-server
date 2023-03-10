import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { DownloadUrlDto } from '../dto/DownloadUrl.dto';

@Injectable()
export class GetUrlService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
  ) {}

  async getOneForDownloadUrl(photoId: string) {
    return await this.findOneForS3Path(photoId)
      .then((s3Path) => this.s3Service.getObjectUrl(new URL(s3Path)))
      .then((url) => this.mapFromRelationForDownloadUrl(url));
  }

  async getOneForUploadUrl(coupleId: string, name: string) {
    const s3Path = this.createForS3Path(coupleId, name);
    const url = await this.s3Service.getUploadUrl(new URL(s3Path));
    return { url, s3Path };
  }

  async findOneForS3Path(photoId: string) {
    const photo = await this.prismaService.photos.findUnique({
      where: { id: photoId },
      include: { VideoStorage: true },
    });

    let s3Path = photo.s3Path;

    if (photo.videoId) s3Path = photo.VideoStorage.s3Path;

    return s3Path;
  }

  createForS3Path(coupleId: string, name: string) {
    return `s3://growing-user-gallery/${coupleId}/photos/${name}`;
  }

  mapFromRelationForDownloadUrl(url: string) {
    const dto: DownloadUrlDto = {
      url,
    };
    return dto;
  }
}
