import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../libs/index.js';
import {Middleware} from '../interface/index.js';
import {DataUaer} from '../type.js';
import {appDataSource} from '../../main.js';

export class CheckUserMiddleware implements Middleware {
  constructor() {}

  public async execute({ tokenPayload:{id, name} }: Request, _res: Response, next: NextFunction): Promise<void> {
    const dataUser = await appDataSource.manager.query(`
      SELECT *
      FROM users
      WHERE users.id = $1
    `,[id]
    )

     const _dataUser: DataUaer = dataUser.find((item: DataUaer) => item)

    if (!_dataUser) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `User ${name} is not in the database.`
      );
    }

    return next();
  }
}
