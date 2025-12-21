import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export const jwtAdapter = {
    generateToken: (payload: any, expiration: string = '2h'): Promise<string|undefined> => {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: expiration} as SignOptions, (err, decoded) => {
                if (err) return resolve(undefined);
                resolve(decoded);
            })
        });

     },
     validateToken: <T>(token: string): Promise<T | null> => {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded as T);
            })
        });
     }
}