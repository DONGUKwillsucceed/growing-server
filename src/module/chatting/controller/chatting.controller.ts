import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ChattingProxyService } from '../service/chatting-proxy.service';

@ApiTags('Chatting에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings')
export class ChattingController {
  constructor(private readonly chattingProxyService: ChattingProxyService) {}
  @Get('')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiQuery({ name: 'base', required: true })
  @ApiQuery({ name: 'offset', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    let query1 = req.query.base as string;
    let query2 = req.query.limit as string;
    const base = parseInt(query1);
    const limit = parseInt(query2);

    return await this.chattingProxyService.findMany(
      coupleId,
      userId,
      base,
      limit,
    );
  }

  @Get(':chattingId/photos')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findManyForPhoto(@Req() req: UserAuthRequest) {
    const chattingId = req.params.chattingId;
    return await this.chattingProxyService.findManyForPhoto(chattingId);
  }

  @Delete(':chattingId/delete-ours')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async deleteOneForOurs(@Req() req: UserAuthRequest) {
    const chattingId = req.params.chattingId;
    return await this.chattingProxyService.removeOneForOurs(chattingId);
  }

  @Delete(':chattingId/delete-mine')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async deleteOneForMine(@Req() req: UserAuthRequest) {
    const chattingId = req.params.chattingId;
    const userId = req.user.id;
    return await this.chattingProxyService.removeOneForMine(chattingId, userId);
  }
}
