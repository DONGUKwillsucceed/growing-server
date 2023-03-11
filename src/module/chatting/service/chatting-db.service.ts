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

  async findOne(chattingId: string) {
    return this.prismaService.chattings.findUnique({
      where: {
        id: chattingId,
      },
      include: {
        Users: { include: { Photos_PhotosToUsers_profileId: true } },
        Couples: true,
        Chatting_Photo: {
          include: {
            Photos: { include: { VideoStorage: true } },
          },
        },
        VoiceStorage: true,
        Chatting_Emoji: {
          include: {
            Emojis: true,
          },
        },
      },
    });
  }

  async findMany(coupleId: string, userId: string, skip: number, take: number) {
    return await this.prismaService.chattings.findMany({
      where: {
        coupleId,
        User_Chatting_IsDeleted: {
          none: {
            userId,
            isDeleted: 1,
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Users: {
          include: { Photos_PhotosToUsers_profileId: true },
        },
        Couples: true,
        Chatting_Photo: {
          include: {
            Photos: { include: { VideoStorage: true } },
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
            Users: { include: { Photos_PhotosToUsers_profileId: true } },
            Couples: true,
            Chatting_Photo: {
              include: {
                Photos: { include: { VideoStorage: true } },
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

  async updateOneForIsDeletedWithChattingId(chattingId: string) {
    return await this.prismaService.user_Chatting_IsDeleted.updateMany({
      where: {
        chattingId,
      },
      data: {
        isDeleted: 1,
      },
    });
  }

  async updateOneForIsDeletedWithChattingIdAndUserId(
    chattingId: string,
    userId: string,
  ) {
    return await this.prismaService.user_Chatting_IsDeleted.updateMany({
      where: {
        chattingId,
        userId,
      },
      data: {
        isDeleted: 1,
      },
    });
  }
}
