import { Chatting_Photo, Photos, Users } from '@prisma/client';

export type ChattingType = Chatting_Photo & {
  Photos: Photos & {
    Users: Users;
  };
};

export type ChattingPhotoType = ChattingType & {
  imageUrl: string;
};
