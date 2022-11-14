import { Answer } from '../types/Answer.interface';

export interface QuestionsAndAnswersDto {
  question: {
    id: string;
    content: string;
    createdAt: Date;
  };
  myAnswer: Answer | null;
  partnerAnswer: Answer | null;
}
