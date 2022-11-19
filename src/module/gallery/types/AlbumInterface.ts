import { Albums, Albums_Photos, Photos } from '@prisma/client';

export interface AlbumPhotoInterface extends Albums {
  Albums_Photos: (Albums_Photos & {
    Photos: Photos;
  })[];
}

export interface PhotoImageUrlInterface extends Photos {
  imageUrl: string;
}

export interface AlbumPhotoImageUrlInterface extends AlbumPhotoInterface {
  imageUrl: string;
}
