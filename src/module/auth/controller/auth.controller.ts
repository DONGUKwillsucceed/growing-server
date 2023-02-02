import { Controller, Post, UseFilters, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { RefreshTokenDto } from '../dto/CreateJWT.dto';
import { KakaoCodeDto } from '../dto/KakaoCodeDto';
import { AuthProxyService } from '../service/auth-proxy.service';

@ApiTags('Auth에 접근하는 Rest API')
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}
  @Post('log-in')
  @ApiBody({ type: KakaoCodeDto })
  @ApiBearerAuth('jwt-token')
  async logIn(@Body(ValidationPipe) dto: KakaoCodeDto) {
    const userId = await this.authProxyService.logIn(dto);
    const { accessToken } = await this.authProxyService.getAccessToken(userId);
    const { refreshToken } = await this.authProxyService.getRefreshToken(
      userId,
    );

    return { userId, accessToken, refreshToken };
  }

  @Post('test')
  async test(@Body(ValidationPipe) dto: RefreshTokenDto) {
    const userId = dto.userId;
    const { accessToken } = await this.authProxyService.getAccessToken(userId);
    const { refreshToken } = await this.authProxyService.getRefreshToken(
      userId,
    );

    return { userId, accessToken, refreshToken };
  }
}
