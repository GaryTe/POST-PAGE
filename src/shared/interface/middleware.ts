import { Response, Request, NextFunction } from 'express';

export interface Middleware {
    execute(req: Request, res: Response, next: NextFunction): void;
  }