import {
  Controller,
  Get,
  Post,
  Req,
  Delete,
  UseGuards,
  UseFilters,
  Param,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { UploadUrlRequestDto } from '../dto/UploadUrlRequest.dto';
import { PhotoLineMapper } from '../mapper/photo-line.mapper';
import { PhotoMapper } from '../mapper/photo.mapper';
import { PhotoProxyService } from '../service/photo-proxy.service';

@ApiTags('Gallery에 대한 Rest API')
@Controller('couples/:coupleId/gallerys/photos')
@UseFilters(HttpExceptionFilter)
export class GalleryPhotoController {
  constructor(
    private readonly photoProxyService: PhotoProxyService,
    private readonly photoMapper: PhotoMapper,
    private readonly photoLineMapper: PhotoLineMapper,
  ) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiQuery({ name: 'base', required: true })
  @ApiQuery({ name: 'offset', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(
    @Param('coupleId') coupleId: string,
    @Query('base', new DefaultValuePipe(0), ParseIntPipe) base: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.photoProxyService
      .findMany(coupleId, base, limit)
      .then((photo) => this.photoLineMapper.mapFromRelation(photo));
  }

  @Get(':photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOne(@Param('photoId') photoId: string) {
    return this.photoProxyService
      .findOne(photoId)
      .then((photo) => this.photoMapper.mapFromRelation(photo));
  }

  @Post('get-upload-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: UploadUrlRequestDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOneForUploadUrl(
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: UploadUrlRequestDto,
  ) {
    return this.photoProxyService.findOneForUploadUrl(coupleId, dto.name);
  }

  @UseGuards(UserAuthGuard)
  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: CreatePhotoRequestDto })
  @ApiBearerAuth('jwt-token')
  async create(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: CreatePhotoRequestDto,
  ) {
    const userId = req.user.id;
    return this.photoProxyService.create(dto, coupleId, userId);
  }

  @UseGuards(UserAuthGuard)
  @Post(':photoId/get-download-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  async findOneForDownloadUrl(@Param('photoId') photoId: string) {
    return this.photoProxyService.findOneForDownloadUrl(photoId);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  async remove(@Param('photoId') photoId: string) {
    await this.photoProxyService.remove(photoId);
  }
}
