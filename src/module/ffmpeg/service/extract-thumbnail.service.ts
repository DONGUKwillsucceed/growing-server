import Ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';
import ffmpegstatic from 'ffmpeg-static';
import { tmpdir } from 'os';
import { S3Service } from 'src/service/S3.service';

setFfmpegPath(ffmpegstatic);

export class ExtractThumbnailService {
  constructor(private readonly s3Service: S3Service) {}

  async extract(coupleId: string, s3Path: string) {
    const url = await this.s3Service.getObjectUrl(new URL(s3Path));
    let s3PathUpload = 's3://growing-user-gallery/';
    let filePath: string;

    Ffmpeg(url)
      .on('filenames', async (filenames) => {
        console.log('Will generate ' + filenames.join(', '));
        filePath = `${coupleId}/photos/${filenames[0]}`;
      })
      .on('end', async () => {
        console.log('Screenshots taken');
        s3PathUpload += filePath;
        await this.uploadThumbnail(s3PathUpload, tmpdir() + filePath);
      })
      .on('error', async (err) => {
        console.log(err);
      })
      .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 1,
        folder: `${tmpdir()}/${coupleId}/photos`,
        size: '320x200',
        // %b input basename ( filename w/o extension )
        filename: 'thumbnail-%b.png',
      });

    return s3PathUpload;
  }

  async uploadThumbnail(s3Path: string, filePath: string) {
    const url = await this.s3Service.getUploadUrl(new URL(s3Path));

    await this.s3Service.uploadFile(new URL(url), filePath);
  }
}
