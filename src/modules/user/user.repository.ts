import pg, {QueryResult} from 'pg';
import { StatusCodes } from 'http-status-codes';

import {WAITING_TIME, CLIENT_INACTIVITY_TIME} from '../../shared/const.js';
import {RegistrationUserDto} from './dto/index.js';
import {DataUaer} from '../../shared/type.js';
import {setPassword} from '../../shared/util.js';
import {HttpError} from '../../shared/libs/http-error.js';

let client: pg.Pool;

export class UserRepository {
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
  
    public async registration(dto: RegistrationUserDto, salt: string): Promise<DataUaer> {
      const {name, password} = dto;
      const hashPassword = setPassword(password, salt)
      let dataUser: QueryResult;
      
      dataUser = await client.query(`
        SELECT *
        FROM users
        WHERE users.name = $1
      `,[name]
      )
      
      if(dataUser.rows.length !== 0) {
        throw new HttpError(
            StatusCodes.BAD_REQUEST,
            `A user with name ${name} is exists.`,
          );
      }
      
      dataUser = await client.query(`
        INSERT INTO users
        VALUES (DEFAULT, $1, $2)
        RETURNING 
        users.id,
        users.name
        `,[name, hashPassword]
      );
  
      return dataUser.rows.find((item: DataUaer) => item);
    }
}