import express, {Express} from 'express';
import 'dotenv/config'

import {info} from './shared/logger.js';
import {UserController} from './modules/user/user.controller.js';
import {RecordController} from './modules/record/record.controller.js';
import {AppExceptionFilter, HttpExceptionFilter, AuthenticationExceptionFilter} from './shared/libs/index.js';
import {ParseAccessTokenMiddleware} from '../src/shared/middleware/index.js';
import {checkingEnvironmentVariables} from './shared/util.js';
import {STATIC_UPLOAD_ROUTE} from './shared/const.js';

const server: Express = express();

const initServer = async () => {
    const port = process.env.PORT;
    server.listen(port);
}

const initControllers = async() => {
    server.use('/user', new UserController().router);
    server.use('/record', new RecordController().router);
} 

const initMiddleware = async () => {
    server.use(express.json());
    server.use(
        STATIC_UPLOAD_ROUTE,
        express.static(process.env.UPLOAD_DIRECTORY as string)
      );
    server.use(new ParseAccessTokenMiddleware().execute)
}

const initExceptionFilters = async () => {
    server.use(new AuthenticationExceptionFilter().catch);
    server.use(new HttpExceptionFilter().catch);
    server.use(new AppExceptionFilter().catch);
  }

  info('Checking environment variables.');
  checkingEnvironmentVariables()
  info('Environment variables check completed successfully.')

  info('Init express middleware');
  await initMiddleware();
  info('Express middleware initialization completed');

  info('Init controllers');
  await initControllers();
  info('Controller initialization completed');

  info('Init exception filters');
  await initExceptionFilters();
  info('Exception filters initialization compleated');
  
  info('Try to init server');
  await initServer();
  info(`Server started on http://${process.env.HOST}:${process.env.PORT} !!!`); 