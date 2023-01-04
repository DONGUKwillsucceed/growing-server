import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Req,
  Param,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { EmojiService } from '../service/emoji.service';

@Controller('users/:userId/emojis')
@UseFilters(HttpExceptionFilter)
export class EmojiController {
  constructor(private readonly emojiProxyService: EmojiService) {}
  @Get()
  @UseGuards(UserAuthGuard)
  async findManyForEmojiPackage(@Param('userId') userId: string) {
    return this.emojiProxyService.findManyForEmojiPackage(userId);
  }

  @Get(':emojiId')
  @UseGuards(UserAuthGuard)
  async findManyForEmoji(@Param('emojiId') emojiId: string) {
    return this.emojiProxyService.findManyForEmoji(emojiId);
  }
}
