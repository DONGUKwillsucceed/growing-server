export interface PhotoDto {
  id: string; // chatting id
  createdAt: Date;
  name: string;
  photos: {
    id: string;
    url: string;
  }[];
  video: {
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
    time: number;
  } | null;
}
