import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Body,
  Query,
  UseFilters,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { AnswerDto } from '../dto/Answer.dto';
import { QuestionMapper } from '../mapper/question.mapper';
import { QuestionProxyService } from '../service/question-proxy.service';

@ApiTags('Question에 접근하는 Rest API')
@Controller('couples/:coupleId/questions')
@UseFilters(HttpExceptionFilter)
export class QuestionController {
  constructor(
    private readonly questionProxyService: QuestionProxyService,
    private readonly questionMapper: QuestionMapper,
  ) {}
  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiQuery({ name: 'to-do', required: false })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Query('to-do', ParseBoolPipe) toDo: boolean,
  ) {
    const userId = req.user.id;
    if (toDo === true) {
      return this.questionProxyService.isRemain(coupleId, userId);
    }
    return this.questionProxyService
      .findMany(coupleId)
      .then((questions) =>
        this.questionMapper.mapFromRelationForMany(questions, userId),
      );
  }

  @Post(':questionId/answer')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'questionId', required: true })
  @ApiBody({ type: AnswerDto })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async answer(
    @Req() req: UserAuthRequest,
    @Param('coupleId') coupleId: string,
    @Param('questionId') questionId: string,
    @Body(ValidationPipe) dto: AnswerDto,
  ) {
    const userId = req.user.id;
    await this.questionProxyService
      .answer(dto, questionId, userId, coupleId)
      .then((question) =>
        this.questionMapper.mapFromRelationForOne(question, userId),
      );
  }
}
