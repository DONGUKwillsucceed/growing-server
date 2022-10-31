import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class ChattingDBService {
  constructor(private readonly prismaService: PrismaService) {}

  ChattingIncludeQuery = {
    Users: true,
    Couples: true,
    Chatting_Photo: {
      include: {
        Photos: true,
      },
    },
    VoiceStorage: true,
    Chatting_Emoji: {
      include: {
        Emojis: true,
      },
    },
  };

  async findMany(coupleId: string) {
    return await this.prismaService.chattings.findMany({
      where: {
        coupleId,
      },
      include: {
        Users: true,
        Couples: true,
        Chatting_Photo: {
          include: {
            Photos: true,
          },
        },
        VoiceStorage: true,
        Chatting_Emoji: {
          include: {
            Emojis: true,
          },
        },
        other_Chattings: {
          include: {
            Users: true,
            Couples: true,
            Chatting_Photo: {
              include: {
                Photos: true,
              },
            },
            VoiceStorage: true,
            Chatting_Emoji: {
              include: {
                Emojis: true,
              },
            },
          },
        },
      },
    });
  }
}
