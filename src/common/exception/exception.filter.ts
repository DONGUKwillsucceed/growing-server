import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/service/prisma.service';
import { INJECTION_TOKEN } from '../const';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(PrismaService) private readonly prismaService: PrismaService;
  @Inject(INJECTION_TOKEN) private readonly label: string;
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      await this.prismaService.error_Log.create({
        data: {
          label: this.label,
          message: exception.message,
          stack: exception.stack,
          name: exception.name,
        },
      });
      exception = new InternalServerErrorException('Unexpected Error');
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    console.log(log);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
