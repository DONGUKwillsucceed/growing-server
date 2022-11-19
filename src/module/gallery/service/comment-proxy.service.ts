import { Injectable } from '@nestjs/common';
import { GetCommentService } from './get-comment.service';
@Injectable()
export class CommentProxyService {
  constructor(private readonly getCommentService: GetCommentService) {}
  async findMany(photoId: string, userId: string) {
    return await this.getCommentService.findMany(photoId, userId);
  }

  async create(photoId: string, userId: string) {}

  async remove(commentId: string) {}
}
