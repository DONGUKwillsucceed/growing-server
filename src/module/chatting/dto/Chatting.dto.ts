export interface ChattingDto {
  id: string;
  content: string | null;
  emojiUrl: string | null;
  imageUrls: string[]; // 사진, 비디오
  voiceMsgUrls: string[];
  createdAt: Date;
  isMine: boolean;
  Writer: {
    id: string;
    name: string;
    imageUrl: string;
  };
}
