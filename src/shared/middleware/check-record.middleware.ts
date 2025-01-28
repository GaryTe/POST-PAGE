import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../libs/index.js';
import {Middleware} from '../interface/index.js';
import {DataRecord, Params} from '../type.js';
import {appDataSource} from '../../main.js';

export class CheckRecordMiddleware implements Middleware {
  constructor() {}

  public async execute({params:{idRecord}}: Request<Params>, _res: Response, next: NextFunction): Promise<void> {
    const dataRecord = await appDataSource.manager.query(`
      SELECT *
      FROM records
      WHERE records.id = $1
    `,[idRecord]
    )

     const _dataRecord: DataRecord = dataRecord.find((item: DataRecord) => item)

    if (!_dataRecord) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Record does not exist in the database.'
      );
    }

    return next();
  }
}
