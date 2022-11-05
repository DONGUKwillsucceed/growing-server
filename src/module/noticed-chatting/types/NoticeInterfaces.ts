import {
  Chattings,
  NoticedChatting,
  Users,
  User_NoticedChatting_IsDeleted,
} from '@prisma/client';

export type NoticedChattingInterface = User_NoticedChatting_IsDeleted & {
  NoticedChatting: NoticedChatting & {
    Chattings: Chattings;
    Users: Users;
  };
};
