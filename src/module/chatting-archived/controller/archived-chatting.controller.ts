import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  InternalServerErrorException,
  UseFilters,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ChattingArchivedMapper } from '../mapper/chatting-archived.mapper';
import { ArchivedChattingProxyService } from '../service/archived-chatting-proxy.service';

@ApiTags('Chatting-archived에 접근하는 Rest API')
@Controller('couples/:coupleId')
@UseFilters(HttpExceptionFilter)
export class ArchivedChattingController {
  constructor(
    private readonly archivedChattingProxyService: ArchivedChattingProxyService,
    private readonly chattingArchivedMapper: ChattingArchivedMapper,
  ) {}
  @Post('chattings/:chattingId/archive')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async archive(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Param('chattingId') chattingId: string,
  ) {
    const userId = req.user.id;
    return this.archivedChattingProxyService
      .archive(coupleId, userId, chattingId)
      .then((chatting) =>
        this.chattingArchivedMapper.mapFromRelationForOne(chatting),
      );
  }

  @Get('archived-chattings')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('coupleId') coupleId: string) {
    return this.archivedChattingProxyService
      .findMany(coupleId)
      .then((chattings) =>
        this.chattingArchivedMapper.mapFromRelationForMany(chattings),
      );
  }

  @Delete('archived-chattings/:chattingId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async remove(@Param('chattingId') chattingId: string) {
    await this.archivedChattingProxyService.unstore(chattingId);
  }
}
