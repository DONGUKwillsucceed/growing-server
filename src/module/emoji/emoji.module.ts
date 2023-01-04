import { MiddlewareConsumer, Module } from '@nestjs/common';
import { INJECTION_TOKEN } from 'src/common/const';
import { UserAuthMiddleware } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { EMOJI_LABEL } from './const';
import { EmojiController } from './controller/emoji.controller';
import { EmojiLineMapper } from './mapper/emoji-line.mapper';
import { EmojiPackageLineMapper } from './mapper/emoji-package-line.mapper';
import { EmojiService } from './service/emoji.service';
import { GetEmojiService } from './service/get-emoji.service';

@Module({
  controllers: [EmojiController],
  providers: [
    EmojiLineMapper,
    EmojiPackageLineMapper,
    EmojiService,
    GetEmojiService,
    PrismaService,
    {
      provide: INJECTION_TOKEN,
      useValue: EMOJI_LABEL,
    },
  ],
})
export class EmojiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(EmojiController);
  }
}
