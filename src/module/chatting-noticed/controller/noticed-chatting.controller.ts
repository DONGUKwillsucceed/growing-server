import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { NoticedChattingProxyService } from '../service/noticed-chatting-proxy.service';

@ApiTags('Chatting-noticed에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings')
export class NoticedChattingController {
  constructor(
    private readonly noticedChattingProxyService: NoticedChattingProxyService,
  ) {}

  @Post(':chattingId/notify')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async notify(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const chattingId = req.params.chattingId;
    const userId = req.user.id;
    await this.noticedChattingProxyService.notify(coupleId, chattingId, userId);
  }

  @Get('notices')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOne(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    return await this.noticedChattingProxyService.findOne(userId);
  }

  @Post('notices/:noticeId/fold')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'noticeId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async fold(@Req() req: UserAuthRequest) {
    const noticeId = req.params.noticeId;
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
  async delete(@Req() req: UserAuthRequest) {
    const noticeId = req.params.noticeId;
    const userId = req.user.id;
    await this.noticedChattingProxyService.delete(userId, noticeId);
  }
}
