import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEmojiService {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyForEmojiPackage(userId: string) {
    return this.prismaService.emoji_Order.findMany({
      where: { buyerId: userId },
      include: { Emoji_Package: true },
    });
  }

  async findManyForEmoji(packageId: string) {
    return this.prismaService.emoji_Package.findUnique({
      where: { id: packageId },
      include: {
        Emojis: true,
      },
    });
  }
}
