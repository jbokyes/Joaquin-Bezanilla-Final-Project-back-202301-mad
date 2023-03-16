import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Auth, PayloadToken } from '../helpers/auth';
import { HTTPError } from '../error/error';

const debug = createDebug('latino-foods:interceptors');
export interface RequestWithToken extends Request {
  tokenInfo?: PayloadToken;
}

export abstract class Interceptors {
  static logged(req: RequestWithToken, _resp: Response, next: NextFunction) {
    try {
      debug('Logged');
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(498, 'Invalid token', 'No value in auth header');
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Invalid Token', 'No bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.getTokenPayload(token);
      req.tokenInfo = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  static authorized(
    req: RequestWithToken,
    _resp: Response,
    next: NextFunction
  ) {
    try {
      debug('Authorized process');
      if (!req.tokenInfo)
        throw new HTTPError(
          498,
          'Token not found',
          'Token not found in authorized interceptor'
        );
      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found user ID in params');
      if (req.tokenInfo?.id === req.params.id)
        throw new HTTPError(
          401,
          'Unauthorized',
          'The id from params is not equal to ID from token'
        );
      req.body.id = req.tokenInfo.id;
      next();
    } catch (error) {
      next(error);
    }
  }
}
