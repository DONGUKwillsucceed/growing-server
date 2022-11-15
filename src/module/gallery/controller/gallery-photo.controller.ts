import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PhotoProxyService } from '../service/photo-proxy.service';

@Controller('couples/:coupleId/gallerys/photos')
export class GalleryPhotoController {
  constructor(private readonly photoProxyService: PhotoProxyService) {}
  @Get()
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    return await this.photoProxyService.findMany(coupleId);
  }

  @Get(':photoId')
  @UseGuards(UserAuthGuard)
  async findOne(@Req() req: UserAuthRequest) {}

  @Post('get-upload-url')
  @UseGuards(UserAuthGuard)
  async findOneForUploadUrl(@Req() req: UserAuthRequest) {}

  @UseGuards(UserAuthGuard)
  @Post('create')
  async create(@Req() req: UserAuthRequest) {}
}
