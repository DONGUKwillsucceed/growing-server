import { Controller, Post, Res, UseFilters, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { RefreshTokenDto } from '../dto/CreateJWT.dto';
import { KakaoCodeDto } from '../dto/KakaoCodeDto';
import { AuthProxyService } from '../service/auth-proxy.service';
import { Cookie } from '../types/Cookie';

@ApiTags('Auth에 접근하는 Rest API')
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}
  @Post('log-in')
  @ApiBody({ type: KakaoCodeDto })
  @ApiBearerAuth('jwt-token')
  async logIn(@Body(ValidationPipe) dto: KakaoCodeDto, @Res() res: Response) {
    const userId = await this.authProxyService.logIn(dto);
    const { accessToken } = await this.authProxyService.getAccessTokenAndOption(
      userId,
    );
    const { refreshToken, refreshOption } =
      await this.authProxyService.getRefreshTokenAndOption(userId);

    res.cookie(Cookie.Refresh, refreshToken, refreshOption);
    res.json({ userId, accessToken });
  }

  @Post('test')
  async test(@Body(ValidationPipe) dto: RefreshTokenDto, @Res() res: Response) {
    const userId = dto.userId;
    const { accessToken } = await this.authProxyService.getAccessTokenAndOption(
      userId,
    );
    const { refreshToken, refreshOption } =
      await this.authProxyService.getRefreshTokenAndOption(userId);

    res.cookie(Cookie.Refresh, refreshToken, refreshOption);
    res.json({ userId, accessToken });
  }
}
