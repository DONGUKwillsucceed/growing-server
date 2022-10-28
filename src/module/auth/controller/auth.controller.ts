import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { KakaoCodeDto } from '../dto/KakaoCodeDto';
import { AuthProxyService } from '../service/auth-proxy.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}
  @Post('log-in')
  async logIn(@Req() req: Request) {
    const dto = plainToInstance(KakaoCodeDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    return await this.authProxyService.logIn(dto);
  }
}
