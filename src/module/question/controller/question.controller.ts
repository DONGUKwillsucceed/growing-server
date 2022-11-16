import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { AnswerDto } from '../dto/Answer.dto';
import { QuestionProxyService } from '../service/question-proxy.service';

@ApiTags('Question에 접근하는 Rest API')
@Controller('couples/:coupleId/questions')
export class QuestionController {
  constructor(private readonly questionProxyService: QuestionProxyService) {}
  @Get()
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    const toDo = req.query['to-do'] as string;
    const coupleId = req.params.coupleId;
    const userId = req.user.id;
    try {
      if (toDo === 'true') {
        return await this.questionProxyService.isRemain(coupleId, userId);
      }
      return await this.questionProxyService.findMany(coupleId, userId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post(':questionId/answer')
  @UseGuards(UserAuthGuard)
  async answer(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const questionId = req.params.questionId;
    const userId = req.user.id;
    const dto = plainToInstance(AnswerDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }
    try {
      await this.questionProxyService.answer(dto, questionId, userId, coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
