import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { QuestionProxyService } from '../service/question-proxy.service';

@Controller('couples/:coupleId/questions')
export class QuestionController {
  constructor(private readonly questionProxyService: QuestionProxyService) {}
  @Get()
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    return await this.questionProxyService.findMany(coupleId);
  }

  @Post(':questionId/answer')
  async answer(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const questionId = req.params.questionId;
  }
}
