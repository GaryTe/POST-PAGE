import { Request, Response } from 'express';

import {UserService} from './user.service.js';
import { Controller } from '../../shared/libs/controller.abstract.js';
import { HttpMethod } from '../../shared/enum/http-method.js';
import {info} from '../../shared/logger.js';
import {RegistrationUserDto, AuthenticationUserDto} from './dto/index.js';
import {RequestParams, RequestBody} from '../../shared/type.js';
import {AuthenticationUser} from '../../shared/libs/index.js';

export class UserController extends Controller {
    private readonly userService = new UserService();
    private readonly authenticationUser = new AuthenticationUser();

  constructor() {
    super()

    info('Register routes for UserController');
    this.addRoute({
      path: '/registration',
      method: HttpMethod.Post,
      handler: this.registration,
    });
    this.addRoute({
      path: '/authentication',
      method: HttpMethod.Get,
      handler: this.authentication,
    });
  }

  public async registration(
    { body }: Request<RequestParams, RequestBody, RegistrationUserDto>,
    res: Response
  ): Promise<void> {
    const dataUser = await this.userService.registration(body, process.env.SALT as string);
    this.created(res, dataUser);
  }

  public async authentication(
    {body}: Request<RequestParams, RequestBody, AuthenticationUserDto>,
    res: Response
  ): Promise<void> {
    const dataUser = await this.authenticationUser.verify(body);
    const accessToken = await this.authenticationUser.authenticate(dataUser);

    this.ok(res, accessToken);
  }
}
