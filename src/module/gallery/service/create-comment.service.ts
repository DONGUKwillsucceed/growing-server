import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { v4 } from 'uuid';
@Injectable()
export class CreateCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(photoId: string, userId: string, content: string) {
    const data = this.createDate(photoId, userId, content);
    await this.prismaService.photoComments.create({ data });
  }

  createDate(photoId: string, userId: string, content: string) {
    const dto: Prisma.PhotoCommentsUncheckedCreateInput = {
      id: v4(),
      photoId,
      userId,
      content,
    };
    return dto;
  }
}
