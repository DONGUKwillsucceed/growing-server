import {
  Controller,
  Get,
  Post,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PhotoChattingProxyService } from '../service/photo-chatting-proxy.service';

@Controller('couples/:coupleId/chattings/photos')
export class PhotoChattingController {
  constructor(
    private readonly photoChattingProxyService: PhotoChattingProxyService,
  ) {}
  @Get('')
  async findMany() {}

  @Get(':photoId')
  async findOne() {}

  @Post(':photoId/put-gallery')
  async putGallery(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      await this.photoChattingProxyService.putGallery(photoId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Post(':photoId/get-download-url')
  async findDownloadUrl() {}

  @Post('get-upload-url')
  async findUploadUrl() {}

  @Post('create')
  async create() {}
}
