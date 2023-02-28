import { Couples, Photos, Users } from '@prisma/client';

export interface UserCoupleInterface extends Users {
  Couples: Couples & {
    Users: Users[];
  };
  Photos_PhotosToUsers_profileId: Photos;
}

export interface UserCoupleImageUrlInterface extends UserCoupleInterface {
  imageUrl: string;
}
