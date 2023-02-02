import { Controller, UseFilters, Post, Req } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { AuthProxyService } from '../service/auth-proxy.service';

@Controller('auth/refresh')
@UseFilters(HttpExceptionFilter)
export class RefreshController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Post()
  async refresh(@Req() req: UserAuthRequest) {
    const userId = req.user.id;
    const { accessToken } = await this.authProxyService.getAccessToken(userId);
    const { refreshToken } = await this.authProxyService.getRefreshToken(
      userId,
    );

    return { userId, accessToken, refreshToken };
  }
}
