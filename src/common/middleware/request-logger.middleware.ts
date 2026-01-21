import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, headers } = req;

    // Extract Bearer access token only
    let bearerToken: string | undefined;
    if (headers.authorization?.startsWith('Bearer ')) {
      bearerToken = headers.authorization.split(' ')[1];
    }

    this.logger.log(
      `➡️ ${method} ${originalUrl}
    Bearer Access Token: ${bearerToken ?? 'None'}
    Body: ${JSON.stringify(body, null, 2)}
      `,
    );

    next();
  }
}
