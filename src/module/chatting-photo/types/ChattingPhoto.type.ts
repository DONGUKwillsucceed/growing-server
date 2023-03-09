import {
  Chattings,
  Chatting_Photo,
  Photos,
  VideoStorage,
} from '@prisma/client';

export type ChattingPhotoType = Photos & {
  VideoStorage: VideoStorage;
};

export type PhotoImageType = ChattingPhotoType & {
  imageUrl: string;
};
