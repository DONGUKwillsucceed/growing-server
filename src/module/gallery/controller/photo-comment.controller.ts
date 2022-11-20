import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  UseGuards,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { CommentProxyService } from '../service/comment-proxy.service';
@Controller('couples/:coupleId/gallerys/photos/:photoId/comments')
@ApiTags('Comment에 대한 Rest API')
export class PhotoCommentController {
  constructor(private readonly commentProxyService: CommentProxyService) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      const userId = req.user.id;
      return await this.commentProxyService.findMany(photoId, userId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBody({ type: CreateCommentDto })
  @UseGuards(UserAuthGuard)
  async create(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.photoId;
      const userId = req.user.id;
      const dto = plainToInstance(CreateCommentDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException('Bad request');
      }
      await this.commentProxyService.create(photoId, userId, dto.content);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Delete(':commentId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiParam({ name: 'commentId', required: true })
  @UseGuards(UserAuthGuard)
  async remove(@Req() req: UserAuthRequest) {
    try {
      const commentId = req.params.commentId;
      await this.commentProxyService.remove(commentId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
