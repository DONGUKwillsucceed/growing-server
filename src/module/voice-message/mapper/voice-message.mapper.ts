import { VoiceStorage } from '@prisma/client';
import { VoiceMSGLineDTO } from '../dto/VoiceMSGLine.dto';

export class VoiceMessageMapper {
  mapFromRelationForMany(voices: VoiceStorage[]): VoiceMSGLineDTO[] {
    return voices.map((voice) => this.mapFromRelationForOne(voice));
  }

  mapFromRelationForOne(voice: VoiceStorage): VoiceMSGLineDTO {
    const dto: VoiceMSGLineDTO = {
      id: voice.id,
      createdAt: voice.createdAt,
      name: voice.name,
      time: voice.time,
    };
    return dto;
  }
}
