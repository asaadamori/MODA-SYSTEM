import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      Array.isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }
      const { id } = <JwtPayload>verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userService.findOne(+id);
      req.currentUser = currentUser;
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      if (error?.name === 'TokenExpiredError') {
        req.currentUser = null;
        res.setHeader('X-Token-Expired', 'true');
      } else if (error?.name === 'JsonWebTokenError') {
        req.currentUser = null;
      } else {
        req.currentUser = null;
        console.error('JWT verification error:', error.message || error);
      }
    }
    next();
  }
}
interface JwtPayload {
  id: string;
}
