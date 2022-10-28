export interface KakaoData {
  id: number;
  has_signed_up: boolean;
  connected_at: Date;
  synched_at: Date;
  properties: JSON;
  kakao_account: KakaoAccount;
}

interface KakaoAccount {
  email: string;
  name: string;
  birthyear: string;
  birthday: string;
  phone_number: string;
  gender: string;
}
