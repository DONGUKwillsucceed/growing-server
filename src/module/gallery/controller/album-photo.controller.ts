import {
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { AlbumeProxyService } from '../service/album-proxy.service';
import { PhotoProxyService } from '../service/photo-proxy.service';
@Controller('couples/:coupleId/gallerys/albums')
@ApiTags('Album에 대한 Rest API')
export class AlbumPhotoController {
  constructor(
    private readonly albumProxyService: AlbumeProxyService,
    private readonly photoProxyService: PhotoProxyService,
  ) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiOperation({
    description: 'album에 photo가 하나도 없을 시 imageUrl은 빈문자열 임',
  })
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      return await this.albumProxyService.findMany(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Get(':albumId/photos')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  async findManyForPhoto(@Req() req: UserAuthRequest) {
    try {
      const albumId = req.params.albumId;
      return await this.photoProxyService.findManyWithAlbumId(albumId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  async create(@Req() req: UserAuthRequest) {
    try {
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Post(':albumId/photos/create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  async createForPhoto(@Req() req: UserAuthRequest) {
    try {
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Patch(':albumId/change-title')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  async patchForTitle(@Req() req: UserAuthRequest) {
    try {
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Delete(':albumId/photos/:photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  async remove(@Req() req: UserAuthRequest) {
    try {
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
