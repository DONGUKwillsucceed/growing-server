import {
  Controller,
  Req,
  Post,
  UseGuards,
  Param,
  Body,
  UseFilters,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { CreateVoiceMesageDto } from '../dto/CreateVoiceMessage.dto';
import { GetUploadUrlRequestDto } from '../dto/GetUploadUrlRequest.dto';
import { VoiceMessageMapper } from '../mapper/voice-message.mapper';
import { VoiceMessageProxyService } from '../service/voice-message-proxy.service';

@ApiTags('Voice-messages에 접근하는 Rest API')
@UseFilters(HttpExceptionFilter)
@Controller('couples/:coupleId/chattings/voice-messages')
export class VoiceMessageController {
  constructor(
    private readonly voiceMessageProxy: VoiceMessageProxyService,
    private readonly voiceMessageMapper: VoiceMessageMapper,
  ) {}

  @UseGuards(UserAuthGuard)
  @Get()
  async findMany(@Param('coupleId') coupleId: string) {
    return this.voiceMessageProxy
      .findMany(coupleId)
      .then((messages) =>
        this.voiceMessageMapper.mapFromRelationForMany(messages),
      );
  }

  @UseGuards(UserAuthGuard)
  @Post('get-upload-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: GetUploadUrlRequestDto })
  async findOneForUploadUrl(
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: GetUploadUrlRequestDto,
  ) {
    return this.voiceMessageProxy.findOneForUploadUrl(coupleId, dto);
  }

  @UseGuards(UserAuthGuard)
  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: CreateVoiceMesageDto })
  async create(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: CreateVoiceMesageDto,
  ) {
    const userId = req.user.id;
    return this.voiceMessageProxy
      .create(coupleId, userId, dto)
      .then((message) =>
        this.voiceMessageMapper.mapFromRelationForOne(message),
      );
  }

  @UseGuards(UserAuthGuard)
  @Post('get-download-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'voiceId', required: true })
  @ApiBearerAuth('jwt-token')
  async findOneForDownloadUrl(@Param('voiceId') voiceId: string) {
    return await this.voiceMessageProxy.findOneForDownloadUrl(voiceId);
  }
}
