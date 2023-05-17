import { Injectable } from '@nestjs/common';
import { Where } from 'src/module/chatting-photo/types/Where.enum';
import { Gender } from 'src/module/user/types/Gender.enum';
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
    const { imageIds, chattingId } = chatting;
    for (const id of imageIds) {
      const photo = await this.prismaService.photos.findUnique({
        where: { id },
      });
      if (photo.where === Where.Gallery)
        await this.prismaService.photos.update({
          where: { id },
          data: { where: Where.Both },
        });
      await this.prismaService.chatting_Photo.create({
        data: { chattingId, photoId: id },
      });
    }
    return chatting;
  }

  async createManyForVoice(chatting: CreateChattingInterface) {
    const { voiceMsgIds, chattingId } = chatting;

    for (const id of voiceMsgIds) {
      await this.prismaService.voiceStorage.update({
        where: { id },
        data: { chattingId },
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

    await this.prismaService.user_Chatting_IsDeleted.create({
      data: { userId: dto.userId, chattingId: id },
    });

    const partnerId = await this.prismaService.couples
      .findUnique({
        where: { id: dto.coupleId },
        select: { Users: true },
      })
      .then((result) => {
        return result.Users.map((user) => user.id).find(
          (ids) => ids !== dto.userId,
        );
      });

    await this.prismaService.user_Chatting_IsDeleted.create({
      data: { userId: partnerId, chattingId: id },
    });

    await this.increaseLoveGaugeForPet(dto.coupleId, dto.userId);
    return { chattingId: id, ...dto };
  }

  async linkEmoji(chatting: CreateChattingInterface) {
    await this.prismaService.chatting_Emoji.create({
      data: { chattingId: chatting.chattingId, emojiId: chatting.emojiId },
    });
    return chatting;
  }

  async increaseLoveGaugeForPet(coupleId: string, userId: string) {
    const id = await this.getPetId(coupleId);
    const gender = await this.getGender(userId);
    if (await this.isSpeakLoveU(id, gender)) {
      await this.prismaService.pets.update({
        where: { id },
        data: { loveGauge: { increment: 0.5 } },
      });
    }
  }

  async isSpeakLoveU(id: string, gender: string) {
    const { isFemaleSpeakLoveU, isMaleSpeakLoveU } =
      await this.prismaService.petCare.findUnique({
        where: { id },
        select: { isFemaleSpeakLoveU: true, isMaleSpeakLoveU: true },
      });

    if (gender === Gender.Female) {
      await this.prismaService.petCare.update({
        where: { id },
        data: { isFemaleSpeakLoveU: 1 },
      });
      return isFemaleSpeakLoveU;
    }

    await this.prismaService.petCare.update({
      where: { id },
      data: { isMaleSpeakLoveU: 1 },
    });
    return isMaleSpeakLoveU;
  }

  async getGender(userId: string) {
    const { gender } = await this.prismaService.users.findUnique({
      where: { id: userId },
      select: { gender: true },
    });
    return gender;
  }

  async getPetId(coupleId: string) {
    const { id } = await this.prismaService.pets.findFirst({
      where: { coupleId, isDeleted: 0 },
      select: { id: true },
    });
    return id;
  }
}
