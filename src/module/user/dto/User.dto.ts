export interface UserDto {
  id: string;
  name: string;
  nickName: string;
  birthDay: Date;
  anniversaryDay: Date;
  imageUrl: string | null;
  coupleId: string | null;
}
