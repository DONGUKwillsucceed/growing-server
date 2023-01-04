import {
  Controller,
  Delete,
  Get,
  Req,
  UseGuards,
  UseFilters,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ChattingProxyService } from '../service/chatting-proxy.service';

@ApiTags('Chatting에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings')
@UseFilters(HttpExceptionFilter)
export class ChattingController {
  constructor(private readonly chattingProxyService: ChattingProxyService) {}
  @Get('')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiQuery({ name: 'base', required: true })
  @ApiQuery({ name: 'offset', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Query('base', new DefaultValuePipe(0), ParseIntPipe) base: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
  ) {
    const userId = req.user.id;
    return await this.chattingProxyService.findMany(
      coupleId,
      userId,
      base,
      limit,
    );
  }

  @Get('emojis')
  async findManyForEmojiPackage(@Req() req: UserAuthRequest) {
    return this.chattingProxyService.findManyForEmojiPackage(req.user.id);
  }

  @Get('emojis/:emojiId')
  async findManyForEmoji(@Param('emojiId') emojiId: string) {
    return this.chattingProxyService.findManyForEmoji(emojiId);
  }

  @Get(':chattingId/photos')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findManyForPhoto(@Param('chattingId') chattingId: string) {
    return await this.chattingProxyService.findManyForPhoto(chattingId);
  }

  @Delete(':chattingId/delete-ours')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async deleteOneForOurs(@Param('chattingId') chattingId: string) {
    return await this.chattingProxyService.removeOneForOurs(chattingId);
  }

  @Delete(':chattingId/delete-mine')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async deleteOneForMine(
    @Req() req: UserAuthRequest,
    @Param('chattingId') chattingId: string,
  ) {
    const userId = req.user.id;
    return await this.chattingProxyService.removeOneForMine(chattingId, userId);
  }
}
