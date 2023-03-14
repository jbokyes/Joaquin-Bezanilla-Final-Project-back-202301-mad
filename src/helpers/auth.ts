import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { HTTPError } from '../error/error.js';

export interface PayloadToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

const salt = 10;

export abstract class Auth {
  static createJWT(payload: PayloadToken) {
    const JWT = jwt.sign(payload, config.jwtSecret as string);
    if (!config.jwtSecret) console.log('config undefined');
    return JWT;
  }

  static getTokenPayload(token: string) {
    const result = jwt.verify(token, config.jwtSecret as string);
    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid payload', result);
    return result as PayloadToken;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt); // Método de "encriptación" ya asíncrono
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
