import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ChattingProxyService } from '../service/chatting-proxy.service';

@Controller('couples/:coupleId/chattings')
export class ChattingController {
  constructor(private readonly chattingProxyService: ChattingProxyService) {}
  @Get('')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    return await this.chattingProxyService.findMany(coupleId, userId);
  }

  @Delete(':chattingId/delete-ours')
  @UseGuards(UserAuthGuard)
  async deleteOneForOurs(@Req() req: UserAuthRequest) {
    const chattingId = req.params.chattingId;
    return await this.chattingProxyService.removeOneForOurs(chattingId);
  }

  @Delete(':chattingId/delete-mine')
  @UseGuards(UserAuthGuard)
  async deleteOneForMine(@Req() req: UserAuthRequest) {
    const chattingId = req.params.chattingId;
    const userId = req.user.id;
    return await this.chattingProxyService.removeOneForMine(chattingId, userId);
  }
}
