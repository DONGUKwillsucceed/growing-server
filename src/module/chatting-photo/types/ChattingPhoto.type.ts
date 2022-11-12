import { Chattings, Chatting_Photo, Photos } from '@prisma/client';

export type ChattingPhotoType = Chattings & {
  Chatting_Photo: (Chatting_Photo & {
    Photos: Photos;
  })[];
};

export type ChattingPhotoPhotoType = ChattingPhotoType & {
  photos: Photos[];
};

export type PhotoImageType = ChattingPhotoPhotoType & {
  imageUrls: string[];
};
