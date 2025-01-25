import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import pg, {QueryResult} from 'pg';

import {WAITING_TIME, CLIENT_INACTIVITY_TIME} from '../../shared/const.js';
import {AuthenticationUserDto} from '../../modules/user/dto/index.js';
import {DataUaer, TokenPayload} from '../type.js';
import {warn, info} from '../logger.js';
import {UserNotFoundException, UserPasswordIncorrectException} from './index.js';
import {verifyPassword} from '../util.js';

let client: pg.Pool;

export class AuthenticationUser {
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

  public async authenticate(dataUser: DataUaer): Promise<{accessToken: string}> {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET as string;
    const secretKey = crypto.createSecretKey(jwtAccessSecret, 'utf-8');
    const accessTokenPayload: TokenPayload = {
      id: dataUser.id,
      name: dataUser.name
    };

    info(`Create accessToken for ${dataUser.name}`);
    const accessToken = await new SignJWT(accessTokenPayload)
      .setProtectedHeader({
        alg: process.env.JWT_ALGORITHM as string,
        typ: process.env.TYP as string
      })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_ACCESS_EXPIRED as string)
      .sign(secretKey);

    return {
      accessToken: accessToken
    };
  }

  public async verify(dto: AuthenticationUserDto): Promise<DataUaer> {
    const dataUser: QueryResult =await client.query(`
      SELECT *
      FROM users
      WHERE users.name = $1
    `,[dto.name]
    )

    const _dataUser: DataUaer = dataUser.rows.find((item: DataUaer) => item);

    if (!_dataUser) {
      warn(`User with name ${dto.name} not found`);
      throw new UserNotFoundException();
    }

    if (! verifyPassword(dto.password, process.env.SALT as string, _dataUser.password ?? '')) {
      warn(`Incorrect password`);
      throw new UserPasswordIncorrectException();
    }

    return _dataUser
  }


}
