import { QuestionStorage } from '@prisma/client';
import { QuestionsAndAnswersDto } from '../dto/QuestionAnswer.dto';
import { Answer } from '../types/Answer.interface';
import { QuestionAnswerInterface } from '../types/Question.interface';

export class QuestionMapper {
  mapFromRelationForMany(questions: QuestionAnswerInterface[], userId: string) {
    return questions.map((question) =>
      this.mapFromRelationForOne(question, userId),
    );
  }

  mapFromRelationForOne(question: QuestionAnswerInterface, userId: string) {
    const mine = question.other_QuestionStorage.find(
      (question) => question.userId === userId,
    );
    const partners = question.other_QuestionStorage.find(
      (question) => question.userId !== userId,
    );
    let myAnswer: Answer | null = null;
    let partnerAnswer: Answer | null = null;
    if (mine) {
      myAnswer = this.mapToAnswer(mine);
    }
    if (partners) {
      partnerAnswer = this.mapToAnswer(partners);
    }

    const dto: QuestionsAndAnswersDto = {
      question: {
        id: question.id,
        content: question.content,
        createdAt: question.createdAt,
      },
      myAnswer,
      partnerAnswer,
    };
    return dto;
  }

  mapToAnswer(qs: QuestionStorage) {
    const answer: Answer = {
      id: qs.id,
      content: qs.content,
      createdAt: qs.createdAt,
    };
    return answer;
  }
}
