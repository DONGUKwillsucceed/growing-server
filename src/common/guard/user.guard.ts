import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserAuthRequest } from '../interface/UserAuthRequest';

/**
 * req userId가 있을 때, coupleId가 있을 때로 나눠진다.
 */
@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<UserAuthRequest>();

    const { user } = req;
    if (!user) {
      return false;
    }

    const { userId } = req.params;
    const { coupleId } = req.params;
    if (userId) {
      return user.id === userId;
    }
    if (coupleId) {
      return user.coupleId === coupleId;
    }

    return false;
  }
}
