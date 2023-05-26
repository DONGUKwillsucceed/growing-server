import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Controller('notices')
export class NoticeController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async findMany() {
    const notices = await this.prismaService.notice.findMany();
    return notices;
  }

  @Get(':noticeId')
  async findUnique(@Param('noticeId') noticeId: string) {
    const notice = await this.prismaService.notice.findUnique({
      where: { id: Number(noticeId) },
    });

    return notice;
  }
}
