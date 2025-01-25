import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import pg, {QueryResult} from 'pg';

import { HttpError } from '../libs/index.js';
import {Middleware} from '../interface/index.js';
import {WAITING_TIME, CLIENT_INACTIVITY_TIME} from '../const.js';
import {DataRecord, Params} from '../type.js';

let client: pg.Pool;

export class CheckRecordMiddleware implements Middleware {
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

  public async execute({params:{idRecord}}: Request<Params>, _res: Response, next: NextFunction): Promise<void> {
    const dataRecord: QueryResult = await client.query(`
      SELECT *
      FROM records
      WHERE records.id = $1
    `,[Number(idRecord)]
    )

     const _dataRecord: DataRecord = dataRecord.rows.find((item: DataRecord) => item)

    if (!_dataRecord) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Record does not exist in the database.'
      );
    }

    return next();
  }
}
