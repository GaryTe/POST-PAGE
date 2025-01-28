import * as crypto from 'node:crypto';

import {ApplicationError} from './enum/index.js';

export const createSHA256 = (password: string, salt: string): string => {
    const shaHasher = crypto.createHmac('sha256', salt);
    return shaHasher.update(password).digest('hex');
};

export const setPassword = (password: string, salt: string) => {
    const encodPassword = createSHA256(password, salt);
    return encodPassword;
};

export const verifyPassword = (password: string, salt: string, _hashPassword: string) => {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === _hashPassword;
}

export const createErrorObject = (errorType: ApplicationError, error: string) => {
    return { errorType, error};
}

export const checkingEnvironmentVariables = () => {
    if(!process.env.POSTGRES_DB) {
        throw new Error('Specify the environment variable POSTGRES_PORT in the file .env.');
    }
    if(!process.env.POSTGRES_PORT) {
        throw new Error('Specify the environment variable POSTGRES_PORT in the file .env.');
    }
    if(!process.env.POSTGRES_USER) {
        throw new Error('Specify the environment variable POSTGRES_USER in the file .env.');
    }
    if(!process.env.POSTGRES_PASSWORD) {
        throw new Error('Specify the environment variable POSTGRES_PASSWORD in the file .env.');
    }
    if(!process.env.HOST) {
        throw new Error('Specify the environment variable HOST in the file .env.');
    }
    if(!process.env.PORT) {
        throw new Error('Specify the environment variable PORT in the file .env.');
    }
    if(!process.env.SALT) {
        throw new Error('Specify the environment variable SALT in the file .env.');
    }
    if(!process.env.JWT_ACCESS_SECRET) {
        throw new Error('Specify the environment variable JWT_ACCESS_SECRET in the file .env.');
    }
    if(!process.env.TYP) {
        throw new Error('Specify the environment variable TYP in the file .env.');
    }
    if(!process.env.JWT_ALGORITHM) {
        throw new Error('Specify the environment variable JWT_ALGORITHM in the file .env.');
    }
    if(!process.env.JWT_ACCESS_EXPIRED) {
        throw new Error('Specify the environment variable JWT_ACCESS_EXPIRED in the file .env.');
    }
    if(!process.env.UPLOAD_DIRECTORY) {
        throw new Error('Specify the environment variable UPLOAD_DIRECTORY in the file .env.');
    }
}
