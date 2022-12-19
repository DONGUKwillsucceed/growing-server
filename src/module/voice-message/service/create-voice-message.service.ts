import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateVoiceMesageDto } from '../dto/CreateVoiceMessage.dto';
@Injectable()
export class CreateVoiceMessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(coupleId: string, userId: string, dto: CreateVoiceMesageDto) {
    const data = this.createVoiceData(coupleId, userId, dto);
    return this.prismaService.voiceStorage.create({ data });
  }

  createVoiceData(coupleId: string, userId: string, dto: CreateVoiceMesageDto) {
    const { s3Path, chattingId, time } = dto;
    const sec = new Date().getSeconds();
    const data: Prisma.VoiceStorageUncheckedCreateInput = {
      id: uuidv4(),
      coupleId,
      userId,
      s3Path,
      chattingId,
      time,
      name: `음성 메시지 ${sec}`,
    };
    return data;
  }
}
