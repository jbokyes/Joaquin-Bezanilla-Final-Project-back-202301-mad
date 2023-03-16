import { Repo } from '../repository/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Food } from '../entities/food';

const debug = createDebug('latino-foods:food-controller');

export class FoodsController {
  constructor(public foodRepo: Repo<Food>) {
    this.foodRepo = foodRepo;
    debug('Food controller!');
  }

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post-method');
      const newFood = req.body;
      const data = await this.foodRepo.create(newFood);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
