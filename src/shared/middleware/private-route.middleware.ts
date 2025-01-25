import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../libs/index.js';
import {Middleware} from '../interface/index.js';

export class PrivateRouteMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (! tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized'
      );
    }

    return next();
  }
}
