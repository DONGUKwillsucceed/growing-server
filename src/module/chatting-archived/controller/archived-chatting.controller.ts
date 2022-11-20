import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ArchivedChattingProxyService } from '../service/archived-chatting-proxy.service';

@ApiTags('Chatting-archived에 접근하는 Rest API')
@Controller('couples/:coupleId')
export class ArchivedChattingController {
  constructor(
    private readonly archivedChattingProxyService: ArchivedChattingProxyService,
  ) {}
  @Post('chattings/:chattingId/archive')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async archive(@Req() req: UserAuthRequest) {
    try {
      const chattingId = req.params.chattingId;
      const coupleId = req.params.coupleId;
      const userId = req.user.id;
      await this.archivedChattingProxyService.archive(
        coupleId,
        userId,
        chattingId,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Get('archived-chattings')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      return await this.archivedChattingProxyService.findMany(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Delete('archived-chattings/:chattingId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'chattingId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async remove(@Req() req: UserAuthRequest) {
    try {
      const storedChattingId = req.params.chattingId;
      await this.archivedChattingProxyService.unstore(storedChattingId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
