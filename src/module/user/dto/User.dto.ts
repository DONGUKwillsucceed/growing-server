export interface UserDto {
  id: string;
  nickName: string;
  birthDay: Date;
  anniversaryDay: Date;
  imageUrl: string | null;
  coupleId: string | null;
  code: string;
}
