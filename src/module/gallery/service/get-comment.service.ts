import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { PhotoCommentDto } from '../dto/Comment.dto';
import { CommentUserInterface } from '../types/CommentInterface';
@Injectable()
export class GetCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(photoId: string, userId: string) {
    return await this.getMany(photoId).then((comments) =>
      this.mapFromRelation(comments, userId),
    );
  }

  async getMany(photoId: string) {
    return await this.prismaService.photoComments.findMany({
      where: { photoId },
      include: {
        Users: true,
      },
    });
  }

  mapFromRelation(comments: CommentUserInterface[], userId: string) {
    return comments.map((comment) => {
      const dto: PhotoCommentDto = {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        isMine: comment.userId === userId,
        name: comment.Users.nickName,
      };
      return dto;
    });
  }
}
