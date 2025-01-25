import { ParamsDictionary } from 'express-serve-static-core';

export type RequestBody = Record<string, unknown>;
export type RequestParams = Record<string, unknown>;

export type DataUaer = {
    id: number;
    name: string;
    password?: string;
}

export type DataRecord = {
    dataCreat: string;
    message: string;
    id: number;
}

export type TokenPayload = {
    name: string;
    id: number;
  };

export type Params = {
    idRecord: string;
} | ParamsDictionary
