import { Type } from '../types/Type';

export interface PhotoLineDto {
  i: string; // chatting id
  u: string[]; // 최대 두개만 준다.
  c: string;
  t: number | null;
}
