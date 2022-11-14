import { IsString } from 'class-validator';

export class AnswerDto {
  @IsString()
  content: string;
}
