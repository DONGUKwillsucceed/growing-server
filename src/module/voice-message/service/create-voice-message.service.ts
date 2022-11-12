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
    await this.prismaService.voiceStorage.create({ data });
  }

  createVoiceData(coupleId: string, userId: string, dto: CreateVoiceMesageDto) {
    const { s3Path, chattingId } = dto;
    const data: Prisma.VoiceStorageUncheckedCreateInput = {
      id: uuidv4(),
      coupleId,
      userId,
      s3Path,
      chattingId,
    };
    return data;
  }
}
