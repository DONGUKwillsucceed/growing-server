import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
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
      const photoId = req.params.coupleId;
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
  @UseGuards(UserAuthGuard)
  async create(@Req() req: UserAuthRequest) {
    try {
      const photoId = req.params.coupleId;
      const userId = req.user.id;
      await this.commentProxyService.create(photoId, userId);
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
