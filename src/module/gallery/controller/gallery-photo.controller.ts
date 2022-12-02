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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { UploadUrlRequestDto } from '../dto/UploadUrlRequest.dto';
import { PhotoProxyService } from '../service/photo-proxy.service';

@ApiTags('Gallery에 대한 Rest API')
@Controller('couples/:coupleId/gallerys/photos')
@UseFilters(HttpExceptionFilter)
export class GalleryPhotoController {
  constructor(private readonly photoProxyService: PhotoProxyService) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('coupleId') coupleId: string) {
    return await this.photoProxyService.findMany(coupleId);
  }

  @Get(':photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOne(@Param('photoId') photoId: string) {
    return await this.photoProxyService.findOne(photoId);
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
    return await this.photoProxyService.findOneForUploadUrl(coupleId, dto.name);
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
    return await this.photoProxyService.create(dto, coupleId, userId);
  }

  @UseGuards(UserAuthGuard)
  @Post(':photoId/get-download-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  async findOneForDownloadUrl(@Param('photoId') photoId: string) {
    return await this.photoProxyService.findOneForDownloadUrl(photoId);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  async remove(@Param('photoId') photoId: string) {
    this.photoProxyService.remove(photoId);
  }
}
