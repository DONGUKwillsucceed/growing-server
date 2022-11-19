import { PhotoComments, Users } from '@prisma/client';

export interface CommentUserInterface extends PhotoComments {
  Users: Users;
}
