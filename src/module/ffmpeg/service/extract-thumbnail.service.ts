import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';
import ffmpegstatic from 'ffmpeg-static';
import { tmpdir } from 'os';
import { S3Service } from 'src/service/S3.service';
import { Injectable } from '@nestjs/common/decorators';
import { createWriteStream } from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';

//setFfmpegPath(ffmpegstatic);

@Injectable()
export class ExtractThumbnailService {
  constructor(private readonly s3Service: S3Service) {}

  async extract(coupleId: string, s3Path: string) {
    const videoPath = await this.downloadVideo(s3Path);
    const fileName = `${uuidv4()}.jpg`;
    const thumbnailPath = `${tmpdir()}/${fileName}`;
    let s3PathUpload = `s3://growing-user-gallery/${coupleId}/photos/${fileName}`;
    const cmd = `ffmpeg -i ${videoPath} -ss 00:00:00 -vframes 1 ${thumbnailPath}`;
    console.log(videoPath);

    exec(cmd, async (err, stdout, stderr) => {
      if (err) throw err;

      console.log(`[Thumbnail extracted] stdout: ${stdout} stderr: ${stderr}`);
      await this.uploadThumbnail(s3PathUpload, thumbnailPath);
      console.log('[Thumbnail uploaded]');
    });

    // ffmpeg(videoPath)
    //   .on('filenames', async (filenames) => {
    //     console.log('Will generate ' + filenames.join(', '));
    //     filePath = `${coupleId}/photos/${filenames[0]}`;
    //   })
    //   .on('end', async () => {
    //     console.log('Screenshots taken');
    //     s3PathUpload += filePath;
    //     await this.uploadThumbnail(s3PathUpload, tmpdir() + filePath);
    //   })
    //   .on('error', async (err) => {
    //     console.log(err);
    //   })
    //   .screenshots({
    //     // Will take screens at 20%, 40%, 60% and 80% of the video
    //     count: 1,
    //     folder: `${tmpdir()}/${coupleId}/photos`,
    //     size: '320x200',
    //     // %b input basename ( filename w/o extension )
    //     filename: 'thumbnail-%b.png',
    //   });

    return s3PathUpload;
  }

  async uploadThumbnail(s3Path: string, filePath: string) {
    await this.s3Service.uploadFile(new URL(s3Path), filePath);
  }

  async downloadVideo(s3Path: string) {
    const downloadUrl = await this.s3Service.getObjectUrl(new URL(s3Path));

    let videoPath: string;

    return await axios
      .get(downloadUrl, { responseType: 'stream' })
      .then((res) => {
        //파일 이름 확장자명 따라서 정해주기
        let fileName = `${uuidv4()}.${
          res.headers['content-type'].split('/')[1]
        }`;

        videoPath = `${tmpdir()}\\${fileName}`;
        //2. 결과값을 writestream으로 저장
        const writer = createWriteStream(videoPath);
        res.data.pipe(writer);

        return new Promise<string>((resolve, reject) => {
          writer.on('error', (error) => {
            console.log(`동영상 다운로드 스트림 생성 실패 ${error}`);
            reject(error);
          });
          writer.on('close', () => {
            console.log('동영상 다운로드 성공');
            resolve(videoPath);
          });
        });
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}
