import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ArchivedChattingProxyService } from '../service/archived-chatting-proxy.service';

@Controller('couples/:coupleId')
export class ArchivedChattingController {
  constructor(
    private readonly archivedChattingProxyService: ArchivedChattingProxyService,
  ) {}
  @Post('chattings/:chattingId/archive')
  @UseGuards(UserAuthGuard)
  async archive(@Req() req: UserAuthRequest) {
    const chattingId = req.params.chattingId;
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    await this.archivedChattingProxyService.archive(
      coupleId,
      userId,
      chattingId,
    );
  }

  @Get('archived-chattings')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    return await this.archivedChattingProxyService.findMany(coupleId);
  }

  @Delete('archived-chattings/:chattingId')
  @UseGuards(UserAuthGuard)
  async remove(@Req() req: UserAuthRequest) {
    const storedChattingId = req.params.chattingId;
    await this.archivedChattingProxyService.unstore(storedChattingId);
  }
}
