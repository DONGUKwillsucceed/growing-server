import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { UploadUrlRequestDto } from '../dto/UploadUrlRequest.dto';
import { PhotoProxyService } from '../service/photo-proxy.service';

@ApiTags('Gallery에 대한 Rest API')
@Controller('couples/:coupleId/gallerys/photos')
export class GalleryPhotoController {
  constructor(private readonly photoProxyService: PhotoProxyService) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      return await this.photoProxyService.findMany(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Get(':photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOne(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      return await this.photoProxyService.findOne(photoId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Post('get-upload-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: UploadUrlRequestDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOneForUploadUrl(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const dto = plainToInstance(UploadUrlRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Bad request');
    }
    try {
      return await this.photoProxyService.findOneForUploadUrl(
        coupleId,
        dto.name,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @UseGuards(UserAuthGuard)
  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: CreatePhotoRequestDto })
  @ApiBearerAuth('jwt-token')
  async create(@Req() req: UserAuthRequest) {
    const dto = plainToInstance(CreatePhotoRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Bad request');
    }
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    try {
      return await this.photoProxyService.create(dto, coupleId, userId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @UseGuards(UserAuthGuard)
  @Post(':photoId/get-download-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  async findOneForDownloadUrl(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      return await this.photoProxyService.findOneForDownloadUrl(photoId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @UseGuards(UserAuthGuard)
  @Delete(':photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  async remove(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      this.photoProxyService.remove(photoId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
