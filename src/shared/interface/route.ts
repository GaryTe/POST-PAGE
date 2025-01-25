import { Response, Request, NextFunction } from 'express';

import {HttpMethod} from '../enum/http-method.js';
import {Middleware} from './middleware.js';

export interface Route {
    path: string;
    method: HttpMethod;
    handler: (req: Request, res: Response, next: NextFunction) => void;
    middlewares?: Middleware[];
  }