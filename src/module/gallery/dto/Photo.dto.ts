import { Type } from '../types/Type';

export interface PhotoDto {
  id: string; // photo id
  urls: string;
  createdAt: Date;
  name: string;
  type: string;
}
