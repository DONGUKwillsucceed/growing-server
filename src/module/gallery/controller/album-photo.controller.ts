import { Controller, Get, Post, Patch, Req, Delete } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
@Controller('couples/:coupleId/gallerys/albums')
@ApiTags('Album에 대한 Rest API')
export class AlbumPhotoController {
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  async findMany(@Req() req: UserAuthRequest) {}

  @Get(':albumId/photos')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  async findManyForPhoto(@Req() req: UserAuthRequest) {}

  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  async create(@Req() req: UserAuthRequest) {}

  @Post(':albumId/photos/create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  async createForPhoto(@Req() req: UserAuthRequest) {}

  @Patch(':albumId/change-title')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  async patchForTitle(@Req() req: UserAuthRequest) {}

  @Delete(':albumId/photos/:photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  async remove(@Req() req: UserAuthRequest) {}
}
