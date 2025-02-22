import { Router, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';

import {DEFAULT_CONTENT_TYPE} from '../const.js';
import {Route} from '../interface/index.js';
import {info} from '../logger.js';

export abstract class Controller {
  private readonly _router: Router;

  constructor() {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));

    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;
    this._router[route.method](route.path, allHandlers);
    info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {

    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data?: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
