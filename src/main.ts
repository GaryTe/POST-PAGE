import express, {Express} from 'express';
import {DataSource} from 'typeorm';
import 'dotenv/config'
import 'reflect-metadata'

import {info, mistake} from './shared/logger.js';
import {UserController} from './modules/user/user.controller.js';
import {RecordController} from './modules/record/record.controller.js';
import {AppExceptionFilter, HttpExceptionFilter, AuthenticationExceptionFilter} from './shared/libs/index.js';
import {ParseAccessTokenMiddleware} from '../src/shared/middleware/index.js';
import {checkingEnvironmentVariables} from './shared/util.js';
import {STATIC_UPLOAD_ROUTE, WAITING_TIME} from './shared/const.js';

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
      server.use(
        STATIC_UPLOAD_ROUTE,
        express.static(process.env.UPLOAD_VIDEO_DIRECTORY as string)
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

  info('Try to connect to Postgres.');
  export const appDataSource: DataSource = new DataSource({
    type: 'postgres',
    entities: ['src/modules/user/user-entity.ts', 'src/modules/record/record-entity.ts'],
    synchronize: true,
    host: process.env.HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    connectTimeoutMS: WAITING_TIME
    });

    await appDataSource.initialize()
    .then(() => {
        info('Connection established to Postgres !!!')
    })
    .catch((err) => {
        mistake('Connect error to Postgres !!!', err)
    })


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