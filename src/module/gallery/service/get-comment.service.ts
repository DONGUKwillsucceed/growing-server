import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { PhotoCommentDto } from '../dto/Comment.dto';
import { CommentUserInterface } from '../types/CommentInterface';
@Injectable()
export class GetCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(photoId: string, userId: string) {
    return await this.getMany(photoId);
  }

  async getMany(photoId: string) {
    return await this.prismaService.photoComments.findMany({
      where: { photoId, isDeleted: 0 },
      include: {
        Users: true,
      },
    });
  }
}
