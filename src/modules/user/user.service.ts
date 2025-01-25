import {RegistrationUserDto} from './dto/index.js';
import {UserRepository} from './user.repository.js';
import {DataUaer} from '../../shared/type.js';

export class UserService {
    private readonly userRepository = new UserRepository();

  constructor() {}

  public async registration(dto: RegistrationUserDto, salt: string): Promise<DataUaer> {

    const dataUser = await this.userRepository.registration(dto, salt);
    return dataUser;
  }
}