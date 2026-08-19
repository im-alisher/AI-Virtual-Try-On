import { Injectable, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);
  private readonly windowMs = 60 * 1000; // 1 minute
  private readonly maxRequests = 30;
  private clients = new Map<string, RateLimitEntry>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = this.clients.get(ip);

    if (!entry || now > entry.resetTime) {
      this.clients.set(ip, { count: 1, resetTime: now + this.windowMs });
      next();
      return;
    }

    entry.count++;

    if (entry.count > this.maxRequests) {
      this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
      res.status(429).json({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
        error: 'Too Many Requests',
      });
      return;
    }

    next();
  }
}
