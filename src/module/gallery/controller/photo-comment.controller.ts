import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  UseGuards,
  UseFilters,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { PhotoCommentMapper } from '../mapper/photo-comment.mapper';
import { CommentProxyService } from '../service/comment-proxy.service';

@Controller('couples/:coupleId/gallerys/photos/:photoId/comments')
@UseFilters(HttpExceptionFilter)
@ApiTags('Comment에 대한 Rest API')
export class PhotoCommentController {
  constructor(
    private readonly commentProxyService: CommentProxyService,
    private readonly photoCommentMapper: PhotoCommentMapper,
  ) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @UseGuards(UserAuthGuard)
  async findMany(
    @Req() req: UserAuthRequest,
    @Param('photoId') photoId: string,
  ) {
    const userId = req.user.id;
    return this.commentProxyService
      .findMany(photoId, userId)
      .then((comments) =>
        this.photoCommentMapper.mapFromRelationForMany(comments, userId),
      );
  }

  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiBody({ type: CreateCommentDto })
  @UseGuards(UserAuthGuard)
  async create(
    @Req() req: UserAuthRequest,
    @Param('photoId') photoId: string,
    @Body(ValidationPipe) dto: CreateCommentDto,
  ) {
    const userId = req.user.id;
    return this.commentProxyService
      .create(photoId, userId, dto.content)
      .then((comment) =>
        this.photoCommentMapper.mapFromRelationForOne(comment, userId),
      );
  }

  @Delete(':commentId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'photoId', required: true })
  @ApiParam({ name: 'commentId', required: true })
  @UseGuards(UserAuthGuard)
  async remove(@Param('commentId') commentId: string) {
    await this.commentProxyService.remove(commentId);
  }
}
