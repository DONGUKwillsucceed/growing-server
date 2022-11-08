import {
  Controller,
  Get,
  Post,
  Req,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { UploadUrlRequestDto } from '../dto/UploadUrlRequest.dto';
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
  async findDownloadUrl(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      return await this.photoChattingProxyService.findOneForDownloadUrl(
        photoId,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Post('get-upload-url')
  async findUploadUrl(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      const dto = plainToInstance(UploadUrlRequestDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException('Bad request');
      }
      return await this.photoChattingProxyService.findOneForUploadUrl(
        coupleId,
        dto.name,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Post('create')
  async create() {}
}
