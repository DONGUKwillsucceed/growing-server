import { Module } from '@nestjs/common';
import { INJECTION_TOKEN } from 'src/common/const';
import { S3Service } from 'src/service/S3.service';
import { FFMPEG_LABEL } from './const';
import { ExtractThumbnailService } from './service/extract-thumbnail.service';

@Module({
  providers: [
    ExtractThumbnailService,
    S3Service,
    { provide: INJECTION_TOKEN, useValue: FFMPEG_LABEL },
  ],
  exports: [ExtractThumbnailService],
})
export class FFMPEGModule {}
