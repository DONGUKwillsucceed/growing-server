import {
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Delete,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { AddPhotoDto } from '../dto/AddPhoto.dto';
import { CreateAlbumDto } from '../dto/CreateAlbum.dto';
import { PatchAlbumDto } from '../dto/PatchAlbum.dto';
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
  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @ApiOperation({
    description: 'album에 photo가 하나도 없을 시 imageUrl은 빈문자열 임',
  })
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      return await this.albumProxyService.findMany(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Get(':albumId/photos')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findManyForPhoto(@Req() req: UserAuthRequest) {
    try {
      const albumId = req.params.albumId;
      return await this.photoProxyService.findManyWithAlbumId(albumId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post('create')
  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBody({ type: CreateAlbumDto })
  @ApiBearerAuth('jwt-token')
  async create(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      const dto = plainToInstance(CreateAlbumDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0].toString());
      }
      await this.albumProxyService.create(coupleId, req.user.id, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post(':albumId/photos/create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBody({ type: AddPhotoDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async createForPhoto(@Req() req: UserAuthRequest) {
    try {
      const albumId = req.params.albumId;
      const dto = plainToInstance(AddPhotoDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0].toString());
      }
      await this.albumProxyService.addPhoto(albumId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Patch(':albumId/change-title')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBody({ type: PatchAlbumDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async patch(@Req() req: UserAuthRequest) {
    try {
      const albumId = req.params.albumId;
      const dto = plainToInstance(PatchAlbumDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0].toString());
      }
      await this.albumProxyService.patch(albumId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Delete(':albumId/photos/:photoId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async removePhoto(@Req() req: UserAuthRequest) {
    try {
      const albumId = req.params.albumId;
      const photoId = req.params.photoId;
      await this.albumProxyService.removePhoto(albumId, photoId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Delete(':albumId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'albumId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async remove(@Req() req: UserAuthRequest) {
    try {
      const albumId = req.params.albumId;
      await this.albumProxyService.remove(albumId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
