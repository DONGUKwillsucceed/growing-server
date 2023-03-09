import {
  Chattings,
  Chatting_Photo,
  Photos,
  VideoStorage,
} from '@prisma/client';

export type ChattingPhotoType = Chattings & {
  Chatting_Photo: (Chatting_Photo & {
    Photos: Photos & {
      VideoStorage: VideoStorage;
    };
  })[];
};

export type ChattingPhotoPhotoType = ChattingPhotoType & {
  photos: (Photos & {
    VideoStorage: VideoStorage;
  })[];
};

export type PhotoImageType = ChattingPhotoPhotoType & {
  imageUrls: string[];
};
