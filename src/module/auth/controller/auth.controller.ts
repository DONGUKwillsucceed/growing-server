import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { KakaoCodeDto } from '../dto/KakaoCodeDto';
import { AuthProxyService } from '../service/auth-proxy.service';
import { Cookie } from '../types/Cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}
  @Post('log-in')
  async logIn(@Req() req: Request, @Res() res: Response) {
    const dto = plainToInstance(KakaoCodeDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    const user = await this.authProxyService.logIn(dto);

    const { accessToken, accessOption } =
      await this.authProxyService.getAccessTokenAndOption(user.userId);
    const { refreshToken, refreshOption } =
      await this.authProxyService.getRefreshTokenAndOption(user.userId);

    res.cookie(Cookie.Authentication, accessToken, accessOption);
    res.cookie(Cookie.Refresh, refreshToken, refreshOption);

    res.json(user);
  }

  @Post('test')
  async test(@Req() req: Request, @Res() res: Response) {
    const userId = req.body.userId;
    const { accessToken, accessOption } =
      await this.authProxyService.getAccessTokenAndOption(userId);
    const { refreshToken, refreshOption } =
      await this.authProxyService.getRefreshTokenAndOption(userId);
    console.log(accessToken);
    res.cookie(Cookie.Authentication, accessToken, accessOption);
    res.cookie(Cookie.Refresh, refreshToken, refreshOption);

    res.json({ userId });
  }
}