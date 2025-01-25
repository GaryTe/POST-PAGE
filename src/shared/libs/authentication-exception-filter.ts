import { NextFunction, Request, Response } from 'express';

import {BaseUserException} from './base-user-exception.js';
import{info, mistake} from '../logger.js';

export class AuthenticationExceptionFilter {
  constructor() {
    info('Register AuthenticationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    mistake(`[class AuthenticationUser] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'NOT AUTHORIZATION',
        error: error.message,
      });
  }
}
