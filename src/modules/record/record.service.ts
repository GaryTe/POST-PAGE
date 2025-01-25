import {CreateRecordDto, RedactionRecordDto} from './dto/index.js';
import {DataRecord} from '../../shared/type.js';
import {RecordRepository} from './record.repository.js';

export class RecordService {
    private readonly recordRepository = new RecordRepository();

  constructor() {}

  public async create(dto: CreateRecordDto): Promise<DataRecord> {
    const dataRecord = await this.recordRepository.create(dto);
    return dataRecord;
  }

  public async editing(dto: RedactionRecordDto): Promise<DataRecord> {
    const dataRecord = await this.recordRepository.editing(dto);
    return dataRecord;
  }

  public async delete(dto: {idRecord: string, idUser: string}): Promise<string> {
    const notification = await this.recordRepository.delete(dto);
    return notification;
  }
}