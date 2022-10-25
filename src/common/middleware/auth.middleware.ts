import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token || !token.includes('Bearer ', 0)) {
      return next();
    }

    try {
      const decodedToken = this.jwtService.decode(token.replace('Bearer', ''));
      req['claims'] = decodedToken;
      return next();
    } catch (err) {
      console.log(err);
      return next();
    }
  }
}
