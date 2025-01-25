import pg, {QueryResult} from 'pg';

import {CreateRecordDto, RedactionRecordDto} from './dto/index.js';
import {DataRecord} from '../../shared/type.js';
import {WAITING_TIME, CLIENT_INACTIVITY_TIME} from '../../shared/const.js';

let client: pg.Pool;

export class RecordRepository {
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

  public async create(dto: CreateRecordDto): Promise<DataRecord> {
    const {message, idUser} = dto;

    const dataRecord: QueryResult = await client.query(`
      INSERT INTO records
      VALUES (DEFAULT, DEFAULT, $1, $2)
      RETURNING 
      records.created_at AS "dataCreat",
      records.message,
      records.id
      `,
    [message, Number(idUser)]
    );

    return dataRecord.rows.find((item: DataRecord) => item);
  }

  public async editing({message, idRecord, idUser}: RedactionRecordDto): Promise<DataRecord> {
    const dataFilm: QueryResult = await client.query(`
      UPDATE records
      SET message = $1
      WHERE records.id = $2 AND records.id_user = $3
      RETURNING
      records.created_at AS "dataCreat",
      records.message,
      records.id
      `,
    [message, Number(idRecord), Number(idUser)]
    );

    return dataFilm.rows.find((item: DataRecord) => item);
  }

  public async delete({idRecord, idUser}: {idRecord: string, idUser: string}): Promise<string> {
        await client.query(`
          DELETE FROM records
          WHERE records.id = $1 AND records.id_user = $2
          RETURNING *
          `,
        [Number(idRecord), Number(idUser)]
        );
    
        return 'The recording is deleted.';
  }
}