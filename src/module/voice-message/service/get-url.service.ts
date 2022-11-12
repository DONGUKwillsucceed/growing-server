import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { GetUploadUrlRequestDto } from '../dto/GetUploadUrlRequest.dto';
@Injectable()
export class GetUrlService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
  ) {}

  async getOneForDownloadUrl(voiceId: string) {
    return await this.findOneForS3Path(voiceId)
      .then((s3Path) => this.s3Service.getObjectUrl(new URL(s3Path)))
      .then((url) => this.mapFromRelationForDownloadUrl(url));
  }

  async getOneForUploadUrl(coupleId: string, name: string) {
    const s3Path = this.createForS3Path(coupleId, name);
    const url = await this.s3Service.getUploadUrl(new URL(s3Path));
    return { url, s3Path };
  }

  createForS3Path(coupleId: string, name: string) {
    return `s3://growing-user-gallery/${coupleId}/voices/${name}`;
  }

  async findOneForS3Path(voiceId: string) {
    const photo = await this.prismaService.voiceStorage.findUnique({
      where: { id: voiceId },
    });
    return photo.s3Path;
  }

  mapFromRelationForDownloadUrl(url: string) {
    const dto: GetDownloadUrlResponseDto = {
      url,
    };
    return dto;
  }
}
