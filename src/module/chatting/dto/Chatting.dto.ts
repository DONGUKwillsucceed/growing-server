export interface ChattingDto {
  id: string;
  content: string | null;
  emojiUrl: string | null;
  imageUrls: string[]; // 사진, 비디오
  videoUrls: { thumbnailUrl: string; videoUrl: string; time: number }[];
  voiceMsgUrls: { url: string; time: number }[];
  createdAt: Date;
  isMine: boolean;
  isConfirmed: boolean;
  Writer: {
    id: string;
    name: string;
    imageUrl: string;
  };
}
