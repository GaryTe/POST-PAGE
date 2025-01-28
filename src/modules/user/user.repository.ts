import { StatusCodes } from 'http-status-codes';

import {RegistrationUserDto} from './dto/index.js';
import {DataUaer} from '../../shared/type.js';
import {setPassword} from '../../shared/util.js';
import {HttpError} from '../../shared/libs/http-error.js';
import {appDataSource} from '../../main.js'

export class UserRepository {
    constructor() {}
  
    public async registration(dto: RegistrationUserDto, salt: string): Promise<DataUaer> {
      const {name, password} = dto;
      const hashPassword = setPassword(password, salt)
      let dataUser;

      dataUser = await appDataSource.manager.query(`
        SELECT *
        FROM users
        WHERE users.name = $1
      `,[name]
    )
      
      if(dataUser.length !== 0) {
        throw new HttpError(
            StatusCodes.BAD_REQUEST,
            `A user with name ${name} is exists.`,
          );
      }
      
      dataUser = await appDataSource.manager.query(`
        INSERT INTO users
        VALUES (DEFAULT, $1, $2)
        RETURNING 
        users.id,
        users.name
        `,[name, hashPassword]
      );
  
      return dataUser.find((item: DataUaer) => item);
    }
}