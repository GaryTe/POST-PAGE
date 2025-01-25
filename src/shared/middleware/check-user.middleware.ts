import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import pg, {QueryResult} from 'pg';

import { HttpError } from '../libs/index.js';
import {Middleware} from '../interface/index.js';
import {WAITING_TIME, CLIENT_INACTIVITY_TIME} from '../../shared/const.js';
import {DataUaer} from '../type.js';

let client: pg.Pool;

export class CheckUserMiddleware implements Middleware {
  constructor() {
        const { Pool } = pg;
        client = new Pool({
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          host: process.env.HOST,
          port: Number(process.env.POSTGRES_PORT),
          database: process.env.POSTGRES_DB,
          connectionTimeoutMillis: WAITING_TIME,
          idleTimeoutMillis: CLIENT_INACTIVITY_TIME
        });
      }

  public async execute({ tokenPayload:{id, name} }: Request, _res: Response, next: NextFunction): Promise<void> {
    const dataUser: QueryResult = await client.query(`
      SELECT *
      FROM users
      WHERE users.id = $1
    `,[Number(id)]
    )

     const _dataUser: DataUaer = dataUser.rows.find((item: DataUaer) => item)

    if (_dataUser.id !== id) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `User ${name} is not in the database.`
      );
    }

    return next();
  }
}
