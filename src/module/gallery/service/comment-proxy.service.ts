import { Injectable } from '@nestjs/common';
import { CreateCommentService } from './create-comment.service';
import { GetCommentService } from './get-comment.service';
import { RemoveCommentService } from './remove-comment.service';
@Injectable()
export class CommentProxyService {
  constructor(
    private readonly getCommentService: GetCommentService,
    private readonly createCommentService: CreateCommentService,
    private readonly removeCommentService: RemoveCommentService,
  ) {}
  async findMany(photoId: string, userId: string) {
    return await this.getCommentService.findMany(photoId, userId);
  }

  async create(photoId: string, userId: string, comment: string) {
    await this.createCommentService.create(photoId, userId, comment);
  }

  async remove(commentId: string) {
    await this.removeCommentService.remove(commentId);
  }
}
