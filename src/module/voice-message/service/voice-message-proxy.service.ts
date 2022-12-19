import { Injectable } from '@nestjs/common';
import { CreateVoiceMesageDto } from '../dto/CreateVoiceMessage.dto';
import { GetUploadUrlRequestDto } from '../dto/GetUploadUrlRequest.dto';
import { CreateVoiceMessageService } from './create-voice-message.service';
import { GetUrlService } from './get-url.service';
import { GetVoiceMessageService } from './get-voice-message.service';

@Injectable()
export class VoiceMessageProxyService {
  constructor(
    private readonly getUrlService: GetUrlService,
    private readonly createVoiceService: CreateVoiceMessageService,
    private readonly getVoiceService: GetVoiceMessageService,
  ) {}

  async findOneForUploadUrl(coupleId: string, dto: GetUploadUrlRequestDto) {
    return this.getUrlService.getOneForUploadUrl(coupleId, dto.name);
  }

  async findOneForDownloadUrl(voiceId: string) {
    return this.getUrlService.getOneForDownloadUrl(voiceId);
  }

  async create(coupleId: string, userId: string, dto: CreateVoiceMesageDto) {
    return this.createVoiceService.create(coupleId, userId, dto);
  }

  async findMany(coupleId: string) {
    return this.getVoiceService.findMany(coupleId);
  }
}
