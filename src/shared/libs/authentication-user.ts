import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';

import {AuthenticationUserDto} from '../../modules/user/dto/index.js';
import {DataUaer, TokenPayload} from '../type.js';
import {warn, info} from '../logger.js';
import {UserNotFoundException, UserPasswordIncorrectException} from './index.js';
import {verifyPassword} from '../util.js';
import {appDataSource} from '../../main.js';

export class AuthenticationUser {
  constructor() {}

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
    const dataUser = await appDataSource.manager.query(`
      SELECT *
      FROM users
      WHERE users.name = $1
    `,[dto.name]
    )

    const _dataUser: DataUaer = dataUser.find((item: DataUaer) => item);

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
