import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { env } from 'process';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token || !token.includes('Bearer ', 0)) {
      return next();
    }

    try {
      const decodedToken = this.jwtService.verify(
        token.replace('Bearer ', ''),
        {
          secret: env.MY_SECRET_KEY,
        },
      );
      req['claims'] = decodedToken;
      return next();
    } catch (err) {
      console.log('Token expired');
      return next();
    }
  }
}
