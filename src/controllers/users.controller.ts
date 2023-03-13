import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user';
import { HTTPError } from '../error/error.js';
import { Repo } from '../repository/repo.interface';

const debug = createDebug('Latino:users-controller');

export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Controller instantiating');
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Login-post');
      const { email, passwd } = req.body;
      if (!email || !passwd)
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or password');
      const data = await this.repo.search({
        key: 'email',
        value: email,
      });
      if (!data.length)
        throw new HTTPError(403, 'Unauthorized', 'Email not found');
      resp.json({
        results: {
          data,
        },
      });
      debug('Login done by: ' + email);
    } catch (error) {
      next(error);
    }
  }
}
