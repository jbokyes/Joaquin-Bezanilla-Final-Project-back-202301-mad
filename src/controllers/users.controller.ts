import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { Food } from '../entities/food.js';
import { User } from '../entities/user.js';
import { HTTPError } from '../error/error.js';
import { Auth, PayloadToken } from '../helpers/auth.js';
import { RequestWithToken } from '../interceptors/interceptors.js';
import { Repo } from '../repository/repo.interface.js';

const debug = createDebug('latino-foods:users-controller');

export class UsersController {
  constructor(public userRepo: Repo<User>, public foodRepo: Repo<Food>) {
    debug('Controller instantiating');
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Login-post');
      console.log(req.body);
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email or password');
      const data = await this.userRepo.search({
        key: 'email',
        value: req.body.email,
      });
      debug('const data,', data);
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      console.log(req.body.passwd, data[0].passwd);
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not found');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'user',
      };
      const token = Auth.createJWT(payload);
      resp.status(201);
      resp.json({
        token,
        results: [data[0]],
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
      console.log(req.body.email, req.body.passwd, req.body.username);
      // Console log de verificación
      // console.log(await Auth.hash(req.body.passwd));
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.addFoods = [];
      const data = await this.userRepo.create(req.body);
      resp.status(202);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
  async addFavouriteFood(
    req: RequestWithToken,
    resp: Response,
    next: NextFunction
  ) {
    try {
      console.log('addFavourite food controller');
      debug('Controller adding favourite');
      if (!req.tokenInfo)
        throw new HTTPError(498, 'Token not found', 'No token available');
      const actualUser = await this.userRepo.queryId(req.tokenInfo.id);
      console.log('actual user', actualUser);

      console.log('req.tokeninfo', req.tokenInfo);
      console.log('req.params: ', req.params);
      if (!req.params.foodId)
        throw new HTTPError(404, 'Not found', 'Didnt find food ID params');

      console.log('paso');
      const foodToAdd = await this.foodRepo.queryId(req.params.foodId);
      if (actualUser.addFoods.find((item) => item.id === foodToAdd.id))
        throw new HTTPError(
          405,
          'This food plate already exists',
          'Duplicated ID'
        );
      actualUser.addFoods.push(foodToAdd);
      await this.userRepo.update(actualUser);
      resp.status(202);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFavouriteFood(
    req: RequestWithToken,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('Removing food from favourites: controller');
      if (!req.tokenInfo)
        throw new HTTPError(498, 'Token not found', 'Token not found');
      const actualUser = await this.userRepo.queryId(req.tokenInfo.id);
      if (!req.params.id)
        throw new HTTPError(404, 'Food not found', 'Food ID not found');
      const foodToRemove = await this.foodRepo.queryId(req.params.id);
      if (!foodToRemove)
        throw new HTTPError(404, 'Food not found', 'Food ID not found');
      actualUser.addFoods = actualUser.addFoods.filter(
        (item) => item.id !== foodToRemove.id
      );
      await this.userRepo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
