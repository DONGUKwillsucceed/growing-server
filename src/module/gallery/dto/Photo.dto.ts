export interface PhotoDto {
  id: string; // photo id
  urls: string;
  videoUrl: string | null;
  createdAt: Date;
  name: string;
  time: number | null;
}
