import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user';
import { HTTPError } from '../error/error.js';
import { Auth, PayloadToken } from '../helpers/auth.js';
import { Repo } from '../repository/repo.interface';

const debug = createDebug('Latino:users-controller');

export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Controller instantiating');
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Login-post');
      // const { email, passwd } = req.body;
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      debug('!datalength error');
      console.log(req.body.passwd, data[0].passwd);
      console.log(
        'compare',
        await Auth.compare(req.body.passwd, data[0].passwd)
      );
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not found');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'user',
      };
      const token = Auth.createJWT(payload);
      resp.json({
        results: {
          token,
        },
      });
      debug('Login done by: ' + req.body.email);
    } catch (error) {
      next(error);
    }
  }
  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post! (register)');
      if (!req.body.email || !req.body.passwd) {
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or password');
      }
      console.log(req.body.email, req.body.passwd, req.body.name);
      console.log(await Auth.hash(req.body.passwd));
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.addFoods = [];
      const data = await this.repo.create(req.body);
      console.log(data);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
