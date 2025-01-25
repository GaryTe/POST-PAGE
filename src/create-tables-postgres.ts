import 'dotenv/config'
import pg from 'pg'

import {info} from './shared/logger.js';

const { Client } = pg

const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
})

info('Try to connect to Postgres.');
await client.connect();
info('Connection established to Postgres !!!');

info('Creatng table users.')
await client.query(`
    CREATE TABLE users (
    id bigserial NOT NULL,
    name text,
    password text,
    PRIMARY KEY (id)
    )
    `);
info('Table users, created !!!')

info('Creatng table records.')
await client.query(`
    CREATE TABLE records (
    id bigserial NOT NULL,
    created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message text,
    id_user bigserial NOT NULL,
    PRIMARY KEY (id)
    )
    `);
info('Table records, created !!!')

await client.end()
info('Client has disconnected')
