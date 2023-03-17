import { Router as router } from 'express';
import { FoodsController } from '../controllers/food.controller.js';
import { FoodMongoRepo } from '../repository/food.mongo.repo.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repository/user.mongo.repo.js';

const debug = createDebug('latino-foods:food-router');
debug('food-router!');

export const foodsRouter = router();
const foodsRepo = new FoodMongoRepo();
const userRepo = new UsersMongoRepo();
const controller = new FoodsController(foodsRepo);

foodsRouter.post('/create', controller.post.bind(controller));
