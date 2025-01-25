import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '../enum/index.js'
import { createErrorObject } from '../util.js';
import {HttpError} from '../libs/http-error.js';
import {info, mistake} from '../logger.js';

export class HttpExceptionFilter {
  constructor() {
    info('Register HttpExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if(!(error instanceof HttpError)) {
      return next(error);
    }
    mistake(`[class HttpExceptionFilter]: ${error.message}`, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
