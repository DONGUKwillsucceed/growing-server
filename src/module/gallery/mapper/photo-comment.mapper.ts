import { PhotoCommentDto } from '../dto/Comment.dto';
import { CommentUserInterface } from '../types/CommentInterface';

export class PhotoCommentMapper {
  mapFromRelationForMany(comments: CommentUserInterface[], userId: string) {
    return comments.map((comment) =>
      this.mapFromRelationForOne(comment, userId),
    );
  }

  mapFromRelationForOne(comment: CommentUserInterface, userId: string) {
    const dto: PhotoCommentDto = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      isMine: comment.userId === userId,
      name: comment.Users.nickName,
    };
    return dto;
  }
}
