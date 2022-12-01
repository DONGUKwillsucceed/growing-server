import { Injectable } from '@nestjs/common';
import { Where } from 'src/module/chatting-photo/types/Where.enum';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateChattingDto } from '../dto/Create-Chatting.dto';
import { CreateChattingInterface } from '../types/ChattingInterfaces';
@Injectable()
export class CreateChattingService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(dto: CreateChattingDto) {
    return this.createForChatting(dto)
      .then((chatting) => this.createManyForPhoto(chatting))
      .then((chatting) => this.createManyForVoice(chatting))
      .then((chatting) => {
        if (chatting.emojiId) {
          return this.linkEmoji(chatting);
        }
        return chatting;
      });
  }

  async createManyForPhoto(chatting: CreateChattingInterface) {
    const { imageS3Pathes, userId, coupleId, chattingId } = chatting;
    for (const s3Path of imageS3Pathes) {
      const { id } = await this.prismaService.photos.create({
        data: {
          id: uuidv4(),
          userId,
          coupleId,
          s3Path,
          where: Where.Chatting,
        },
        select: {
          id: true,
        },
      });

      await this.prismaService.chatting_Photo.create({
        data: { chattingId, photoId: id },
      });
    }
    return chatting;
  }

  async createManyForVoice(chatting: CreateChattingInterface) {
    const { voiceMsgS3Pathes, userId, coupleId, chattingId } = chatting;

    for (const s3Path of voiceMsgS3Pathes) {
      await this.prismaService.voiceStorage.create({
        data: { id: uuidv4(), s3Path, userId, coupleId, chattingId },
      });
    }
    return chatting;
  }

  async createForChatting(dto: CreateChattingDto) {
    const { id } = await this.prismaService.chattings.create({
      data: {
        id: uuidv4(),
        content: dto.content,
        userId: dto.userId,
        coupleId: dto.coupleId,
      },
      select: { id: true },
    });

    return { chattingId: id, ...dto };
  }

  async linkEmoji(chatting: CreateChattingInterface) {
    await this.prismaService.chatting_Emoji.create({
      data: { chattingId: chatting.chattingId, emojiId: chatting.emojiId },
    });
    return chatting;
  }
}
