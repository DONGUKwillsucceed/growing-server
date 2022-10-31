import { Injectable } from '@nestjs/common';
import { GetChattingService } from './get-chatting.service';

@Injectable()
export class ChattingProxyService {
  constructor(private readonly getChattingService: GetChattingService) {}
  async findMany(coupleId: string, userId: string) {
    return await this.getChattingService.findManyForChattingDto(
      coupleId,
      userId,
    );
  }
}
