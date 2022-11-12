import { Injectable } from '@nestjs/common';
import { CreateVoiceMesageDto } from '../dto/CreateVoiceMessage.dto';
import { GetUploadUrlRequestDto } from '../dto/GetUploadUrlRequest.dto';
import { CreateVoiceMessageService } from './create-voice-message.service';
import { GetUrlService } from './get-url.service';

@Injectable()
export class VoiceMessageProxyService {
  constructor(
    private readonly getUrlService: GetUrlService,
    private readonly createVoiceService: CreateVoiceMessageService,
  ) {}

  async findOneForUploadUrl(coupleId: string, dto: GetUploadUrlRequestDto) {
    return await this.getUrlService.getOneForUploadUrl(coupleId, dto.name);
  }

  async findOneForDownloadUrl(voiceId: string) {
    return await this.getUrlService.getOneForDownloadUrl(voiceId);
  }

  async create(coupleId: string, userId: string, dto: CreateVoiceMesageDto) {
    this.createVoiceService.create(coupleId, userId, dto);
  }
}
