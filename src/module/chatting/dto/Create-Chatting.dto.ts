export class CreateChattingDto {
  content: string | null;
  emojiUrl: string | null;
  imageUrls: string[]; // 사진, 비디오
  voiceMsgUrls: string[];
  userId: string;
}
