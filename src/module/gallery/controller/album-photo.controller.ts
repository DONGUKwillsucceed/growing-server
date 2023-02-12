import {
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Delete,
  Param,
  BadRequestException,
  UseGuards,
  UseFilters,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { AddPhotoDto } from '../dto/AddPhoto.dto';
import { CreateAlbumDto } from '../dto/CreateAlbum.dto';
import { PatchAlbumDto } from '../dto/PatchAlbum.dto';
import { AlbumMapper } from '../mapper/album.mapper';
import { PhotoLineMapper } from '../mapper/photo-line.mapper';
import { AlbumeProxyService } from '../service/album-proxy.service';
import { PhotoProxyService } from '../service/photo-proxy.service';
@Controller('couples/:coupleId/gallerys/albums')
@UseFilters(HttpExceptionFilter)
@ApiTags('Album에 대한 Rest API')
export class AlbumPhotoController {
  constructor(
    private readonly albumProxyService: AlbumeProxyService,
    private readonly photoProxyService: PhotoProxyService,
    private readonly albumMapper: AlbumMapper,
    private readonly photoLineMapper: PhotoLineMapper,
  ) {}
  @Get()
  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @ApiOperation({
    description: 'album에 photo가 하나도 없을 시 imageUrl은 빈문자열 임',
  })
  async findMany(@Param('coupleId') coupleId: string) {
    return this.albumProxyService
      .findMany(coupleId)
      .then((albums) => this.albumMapper.mapFromRelationForMany(albums));
  }

  @Get(':albumId/photos')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findManyForPhoto(@Param('albumId') albumId: string) {
    return this.photoProxyService
      .findManyWithAlbumId(albumId)
      .then((photos) => this.photoLineMapper.mapFromRelation(photos));
  }

  @Post('create')
  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: CreateAlbumDto })
  @ApiBearerAuth('jwt-token')
  async create(
    @Req() req: UserAuthRequest,
    @Body(ValidationPipe) dto: CreateAlbumDto,
  ) {
    await this.albumProxyService.create(req.params.coupleId, req.user.id, dto);
  }

  @Post(':albumId/photos/create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBody({ type: AddPhotoDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async createForPhoto(
    @Param('albumId') albumId: string,
    @Body(ValidationPipe) dto: CreateAlbumDto,
  ) {
    await this.albumProxyService.addPhoto(albumId, dto);
  }

  @Patch(':albumId/change-title')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBody({ type: PatchAlbumDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async patch(
    @Param('albumId') albumId: string,
    @Body(ValidationPipe) dto: PatchAlbumDto,
  ) {
    await this.albumProxyService.patch(albumId, dto);
  }

  @Delete(':albumId/photos/:photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async removePhoto(
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
  ) {
    await this.albumProxyService.removePhoto(albumId, photoId);
  }

  @Delete(':albumId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async remove(@Param('albumId') albumId: string) {
    await this.albumProxyService.remove(albumId);
  }
}
