import { Chatting_Photo, Photos, Users, VideoStorage } from '@prisma/client';

export type ChattingType = Chatting_Photo & {
  Photos: Photos & {
    Users: Users;
    VideoStorage: VideoStorage;
  };
};

export type ChattingPhotoType = ChattingType & {
  imageUrl: string | null;
  video: {
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
    time: number;
  } | null;
};
