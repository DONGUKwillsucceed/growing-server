import {
  Controller,
  Req,
  BadRequestException,
  Post,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreateVoiceMesageDto } from '../dto/CreateVoiceMessage.dto';
import { GetUploadUrlRequestDto } from '../dto/GetUploadUrlRequest.dto';
import { VoiceMessageProxyService } from '../service/voice-message-proxy.service';

@ApiTags('Voice-messages에 접근하는 Rest API')
@Controller('couples/:coupleId/chattings/voice-messages')
export class VoiceMessageController {
  constructor(private readonly voiceMessageProxy: VoiceMessageProxyService) {}

  @UseGuards(UserAuthGuard)
  @Post('get-upload-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: GetUploadUrlRequestDto })
  async findOneForUploadUrl(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const dto = plainToInstance(GetUploadUrlRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }
    try {
      return await this.voiceMessageProxy.findOneForUploadUrl(coupleId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server err');
    }
  }

  @UseGuards(UserAuthGuard)
  @Post('create')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @ApiBody({ type: CreateVoiceMesageDto })
  async create(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    const dto = plainToInstance(CreateVoiceMesageDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    try {
      await this.voiceMessageProxy.create(coupleId, userId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server err');
    }
  }

  @UseGuards(UserAuthGuard)
  @Post('get-download-url')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'voiceId', required: true })
  @ApiBearerAuth('jwt-token')
  async findOneForDownloadUrl(@Req() req: UserAuthRequest) {
    try {
      const voiceId = req.params.voiceId;
      return await this.voiceMessageProxy.findOneForDownloadUrl(voiceId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server err');
    }
  }
}
