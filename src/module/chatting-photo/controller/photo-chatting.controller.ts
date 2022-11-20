import {
  Controller,
  Get,
  Post,
  Req,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreatePhotoRequestDto } from '../dto/CreatePhotoRequest.dto';
import { UploadUrlRequestDto } from '../dto/UploadUrlRequest.dto';
import { PhotoChattingProxyService } from '../service/photo-chatting-proxy.service';

@ApiTags('Chatting-Photo에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings/photos')
export class PhotoChattingController {
  constructor(
    private readonly photoChattingProxyService: PhotoChattingProxyService,
  ) {}
  @Get('')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      return await this.photoChattingProxyService.findMany(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }

  @Post(':photoId/put-gallery')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
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
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
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
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: UploadUrlRequestDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findUploadUrl(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const dto = plainToInstance(UploadUrlRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Bad request');
    }
    try {
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
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: CreatePhotoRequestDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async create(@Req() req: UserAuthRequest) {
    const dto = plainToInstance(CreatePhotoRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Bad request');
    }
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    try {
      return await this.photoChattingProxyService.create(dto, coupleId, userId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
