import { Injectable } from '@nestjs/common';
import { VoiceStorage } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { VoiceMSGLineDTO } from '../dto/VoiceMSGLine.dto';
@Injectable()
export class GetVoiceMessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(coupleId: string) {
    return this.prismaService.voiceStorage
      .findMany({
        where: { coupleId, isDeleted: 0 },
      })
      .then((voices) => this.mapFromRelation(voices));
  }

  mapFromRelation(voices: VoiceStorage[]): VoiceMSGLineDTO[] {
    return voices.map((voice) => {
      const dto: VoiceMSGLineDTO = {
        id: voice.id,
        createdAt: voice.createdAt,
        name: voice.name,
        time: voice.time,
      };
      return dto;
    });
  }
}
