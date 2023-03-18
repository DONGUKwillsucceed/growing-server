import {
  Controller,
  Get,
  Post,
  Req,
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
import { PhotoChattingProxyService } from '../service/photo-chatting-proxy.service';

@ApiTags('Chatting-Photo에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings/photos')
@UseFilters(HttpExceptionFilter)
export class PhotoChattingController {
  constructor(
    private readonly photoChattingProxyService: PhotoChattingProxyService,
  ) {}
  @Get('')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
  ) {
    const userId = req.user.id;
    return this.photoChattingProxyService.findMany(coupleId, userId);
  }

  @Post(':photoId/put-gallery')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async putGallery(@Param('photoId') photoId: string) {
    await this.photoChattingProxyService.putGallery(photoId);
  }

  @Post(':photoId/get-download-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findDownloadUrl(@Param('photoId') photoId: string) {
    return await this.photoChattingProxyService.findOneForDownloadUrl(photoId);
  }

  @Post('get-upload-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: UploadUrlRequestDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findUploadUrl(
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: UploadUrlRequestDto,
  ) {
    return await this.photoChattingProxyService.findOneForUploadUrl(
      coupleId,
      dto.name,
    );
  }

  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: CreatePhotoRequestDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async create(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: CreatePhotoRequestDto,
  ) {
    const userId = req.user.id;
    return await this.photoChattingProxyService.create(dto, coupleId, userId);
  }
}
