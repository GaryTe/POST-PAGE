import {CreateRecordDto, RedactionRecordDto} from './dto/index.js';
import {DataRecord} from '../../shared/type.js';
import {appDataSource} from '../../main.js';

export class RecordRepository {
  constructor() {}

  public async create(dto: CreateRecordDto): Promise<DataRecord> {
    const {message, idUser} = dto;

    const dataRecord = await appDataSource.manager.query(`
      INSERT INTO records
      VALUES (DEFAULT, DEFAULT, $1, $2)
      RETURNING
      creat_at AS "dataCreat",
      records.message,
      records.id
      `,
    [message, idUser]
    );

    return dataRecord.find((item: DataRecord) => item);
  }

  public async editing({message, idRecord, idUser}: RedactionRecordDto): Promise<DataRecord> {
    const dataFilm = await appDataSource.manager.query(`
      UPDATE records
      SET message = $1
      WHERE records.id = $2 AND records.id_user = $3
      RETURNING
      creat_at AS "dataCreat",
      records.message,
      records.id
      `,
    [message, idRecord, idUser]
    );

    return dataFilm.find((item: DataRecord) => item).find((item: DataRecord) => item);
  }

  public async delete({idRecord, idUser}: {idRecord: string, idUser: string}): Promise<string> {
        await appDataSource.manager.query(`
          DELETE FROM records
          WHERE records.id = $1 AND records.id_user = $2
          RETURNING *
          `,
        [idRecord, idUser]
        );
    
        return 'The recording is deleted.';
  }
}