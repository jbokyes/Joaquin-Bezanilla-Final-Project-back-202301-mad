import { Router as router } from 'express';
import { FoodsController } from '../controllers/food.controller.js';
import { FoodMongoRepo } from '../repository/food.mongo.repo.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repository/user.mongo.repo.js';
import { Interceptors } from '../interceptors/interceptors.js';

const debug = createDebug('latino-foods:food-router');
debug('food-router!');

export const foodsRouter = router();
const foodsRepo = new FoodMongoRepo();
const userRepo = new UsersMongoRepo();
const controller = new FoodsController(foodsRepo);

foodsRouter.get('/', controller.getAll.bind(controller));
foodsRouter.get('/:foodId', controller.getId.bind(controller));
foodsRouter.post(
  '/create',
  Interceptors.logged,
  controller.post.bind(controller)
);
foodsRouter.patch(
  '/edit/:foodId',
  Interceptors.logged,
  controller.edit.bind(controller)
);
foodsRouter.delete(
  '/delete/:foodId',
  Interceptors.logged,
  controller.delete.bind(controller)
);
