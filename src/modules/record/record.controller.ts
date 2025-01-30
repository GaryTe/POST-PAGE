import { Request, Response } from 'express';

import { Controller } from '../../shared/libs/index.js';
import {info} from '../../shared/logger.js';
import { HttpMethod } from '../../shared/enum/index.js';
import {RequestParams, RequestBody, Params} from '../../shared/type.js';
import { CreateRecordDto, RedactionRecordDto } from './dto/index.js';
import {
  PrivateRouteMiddleware, 
  CheckUserMiddleware, 
  CheckRecordMiddleware,
  UploadPictureMiddleware
} from '../../shared/middleware/index.js';
import {RecordService} from './record.service.js';
import {STATIC_UPLOAD_ROUTE} from '../../shared/const.js';

export class RecordController extends Controller {
    private readonly recordService = new RecordService();

  constructor() {
    super();

    info('Register routes for RecordController');

    this.addRoute({
      path: '/picture',
      method: HttpMethod.Post,
      handler: this.uploadPicture,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMiddleware(),
        new UploadPictureMiddleware(process.env.UPLOAD_DIRECTORY as string, 'picture'),
      ]
    });
    this.addRoute({
      path: '/video',
      method: HttpMethod.Post,
      handler: this.uploadVideo,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMiddleware(),
        new UploadPictureMiddleware(process.env.UPLOAD_VIDEO_DIRECTORY as string, 'video'),
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMiddleware()
      ]
    });
    this.addRoute({
        path: '/redaction/:idRecord',
        method: HttpMethod.Patch,
        handler: this.editing,
        middlewares: [
          new PrivateRouteMiddleware(),
          new CheckUserMiddleware(),
          new CheckRecordMiddleware()
        ]
      });

      this.addRoute({
        path: '/delete/:idRecord',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          new PrivateRouteMiddleware(),
          new CheckUserMiddleware(),
          new CheckRecordMiddleware()
        ]
      });
  }

  public async uploadPicture({file}: Request, res: Response) {
    const filename = file?.filename as string;
    const path = file?.destination.split('/') as unknown as string[];
    this.created(res, {
      filename: `http://${process.env.HOST}:${process.env.PORT}${STATIC_UPLOAD_ROUTE}/${path[path.length - 2]}/${path[path.length - 1]}/${filename}`
    });
  }

  public async uploadVideo({file}: Request, res: Response) {
    const filename = file?.filename as string;
    const path = file?.destination.split('/') as unknown as string[];
    this.created(res, {
      filename: `http://${process.env.HOST}:${process.env.PORT}${STATIC_UPLOAD_ROUTE}/${path[path.length - 2]}/${path[path.length - 1]}/${filename}`
    });
  }

  public async create(
    { body, tokenPayload }: Request<RequestParams, RequestBody, CreateRecordDto>,
    res: Response
  ): Promise<void> {
    const {id, name} = tokenPayload;
    const dataRecord = await this.recordService.create({...body, idUser: id});

    this.created(res, {
        ...dataRecord, 
        user: {
            id,
            name
        }
    });
  }

  public async editing(
    {body, params:{idRecord}, tokenPayload:{id, name}}: Request<Params, RequestBody, RedactionRecordDto>,
    res: Response
  ): Promise<void> {
    const dataRecord = await this.recordService.editing({...body, idRecord, idUser: id});

    this.ok(res, {
        ...dataRecord, 
        user: {
            id,
            name
        }
    });
  }

  public async delete(
    {params:{idRecord}, tokenPayload:{id}}: Request<Params, RequestBody, RedactionRecordDto>,
    res: Response
  ): Promise<void> {
    const notification = await this.recordService.delete({idRecord, idUser: id});

    this.ok(res, notification);
  }
}
