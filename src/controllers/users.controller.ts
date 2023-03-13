import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user';
import { HTTPError } from '../error/error.js';
import { Auth, PayloadToken } from '../helpers/auth';
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
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(403, 'Unauthorized', 'Password not found');
      const payload: PayloadToken = {
        id: data[0].id,
        email: req.body.email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.json({
        results: {
          token,
        },
      });
      debug('Login done by: ' + email);
    } catch (error) {
      next(error);
    }
  }
}
