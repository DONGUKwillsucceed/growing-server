import { Photos, Users, VideoStorage } from '@prisma/client';

export interface PhotoVideoInterface extends Photos {
  VideoStorage: VideoStorage;
}

export interface PhotoImageUrlInterface extends PhotoVideoInterface {
  imageUrl: string;
}

export interface PhotoUserInterface extends PhotoVideoInterface {
  Users: Users;
}

export interface PhotoUserImageUrlInterface extends PhotoUserInterface {
  imageUrl: string;
}

export interface PhotoUserVideoImageUrlInterface
  extends PhotoUserImageUrlInterface {
  videoUrl: string | null;
}
