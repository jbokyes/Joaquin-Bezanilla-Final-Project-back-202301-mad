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
foodsRouter.get('/:id', controller.getId.bind(controller));
foodsRouter.post('/add', Interceptors.logged, controller.post.bind(controller));
foodsRouter.patch(
  '/edit/:id',
  Interceptors.logged,
  controller.edit.bind(controller)
);
foodsRouter.delete(
  '/:id',
  Interceptors.logged,
  controller.delete.bind(controller)
);
