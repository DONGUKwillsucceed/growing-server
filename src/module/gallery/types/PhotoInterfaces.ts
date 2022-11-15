import { Photos, Users } from '@prisma/client';

export interface PhotoImageUrlInterface extends Photos {
  imageUrl: string;
}

export interface PhotoUserInterface extends Photos {
  Users: Users;
}

export interface PhotoUserImageUrlInterface extends PhotoUserInterface {
  imageUrl: string;
}
