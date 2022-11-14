import { QuestionStorage } from '@prisma/client';

export interface QuestionAnswerInterface extends QuestionStorage {
  other_QuestionStorage: QuestionStorage[];
}
