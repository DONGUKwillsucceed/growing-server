import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { NoticedChattingProxyService } from '../service/noticed-chatting-proxy.service';
@Controller('couples/:coupleId/chattings')
export class NoticedChattingController {
  constructor(
    private readonly noticedChattingProxyService: NoticedChattingProxyService,
  ) {}

  @Post(':chattingId/notify')
  @UseGuards(UserAuthGuard)
  async notify(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const chattingId = req.params.chattingId;
    const userId = req.user.id;
    await this.noticedChattingProxyService.notify(coupleId, chattingId, userId);
  }

  @Get('notices')
  @UseGuards(UserAuthGuard)
  async findOne(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    return await this.noticedChattingProxyService.findOne(userId);
  }

  @Post('notices/:noticeId/fold')
  @UseGuards(UserAuthGuard)
  async fold(@Req() req: UserAuthRequest) {
    const noticeId = req.params.noticeId;
    const userId = req.user.id;
    return await this.noticedChattingProxyService.foldOrUnFold(
      userId,
      noticeId,
    );
  }
}
