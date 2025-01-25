import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '../enum/index.js';
import { createErrorObject } from '../util.js';
import {info, mistake} from '../logger.js';

export class AppExceptionFilter {
  constructor() {
    info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    mistake(`[class AppExceptionFilter]: ${error.message}`, error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
