import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveCommentService {
  constructor(private readonly prismaService: PrismaService) {}
  async remove(commentId: string) {
    await this.prismaService.photoComments.update({
      where: { id: commentId },
      data: { isDeleted: 1 },
    });
  }
}
