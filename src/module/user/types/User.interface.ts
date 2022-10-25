import { Couples, Users } from '@prisma/client';

export interface UserCoupleInterface extends Users {
  Couples: Couples & {
    Users: Users[];
  };
}

export interface UserCoupleImageUrlInterface extends UserCoupleInterface {
  imageUrl: string;
}
