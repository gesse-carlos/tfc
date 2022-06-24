import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { IPayload } from './interfaces';

const JWT_SECRET = readFileSync('jwt.evaluation.key', { encoding: 'utf-8' });

export const sign = (payload: IPayload, duration = '1h') => jwt.sign(payload, JWT_SECRET, {
  algorithm: 'HS256',
  expiresIn: duration,
});

export const verify = (token: string) => jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
