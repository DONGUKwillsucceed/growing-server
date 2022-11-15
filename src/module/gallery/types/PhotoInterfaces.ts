import { Photos } from '@prisma/client';

export interface PhotoImageUrlInterface extends Photos {
  imageUrl: string;
}
