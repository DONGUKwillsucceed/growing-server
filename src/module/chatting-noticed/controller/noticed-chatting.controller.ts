import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { NoticedChattingMapper } from '../mapper/noticed-chatting.mapper';
import { NoticedChattingProxyService } from '../service/noticed-chatting-proxy.service';

@ApiTags('Chatting-noticed에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings')
@UseFilters(HttpExceptionFilter)
export class NoticedChattingController {
  constructor(
    private readonly noticedChattingProxyService: NoticedChattingProxyService,
    private readonly noticedChattingMapper: NoticedChattingMapper,
  ) {}

  @Post(':chattingId/notify')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async notify(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Param('chattingId') chattingId: string,
  ) {
    const userId = req.user.id;
    await this.noticedChattingProxyService.notify(coupleId, chattingId, userId);
  }

  @Get('notices')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOne(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    return await this.noticedChattingProxyService
      .findOne(userId)
      .then((notice) => {
        if (notice) return this.noticedChattingMapper.mapFromRelation(notice);
      });
  }

  @Post('notices/:noticeId/fold')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'noticeId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async fold(@Req() req: UserAuthRequest, @Param('noticeId') noticeId: string) {
    const userId = req.user.id;
    return await this.noticedChattingProxyService.foldOrUnFold(
      userId,
      noticeId,
    );
  }

  @Post('notices/:noticeId/invisible')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'noticeId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async delete(
    @Req() req: UserAuthRequest,
    @Param('noticeId') noticeId: string,
  ) {
    const userId = req.user.id;
    await this.noticedChattingProxyService.delete(userId, noticeId);
  }
}
