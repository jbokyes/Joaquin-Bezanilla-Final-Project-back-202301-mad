import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { Interceptors } from '../interceptors/interceptors.js';
import { FoodMongoRepo } from '../repository/food.mongo.repo.js';
import { UsersMongoRepo } from '../repository/user.mongo.repo.js';

export const userRouter = Router();

const repoUsers = new UsersMongoRepo();
const repoFoods = new FoodMongoRepo();
const controller = new UsersController(repoUsers, repoFoods);

userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
  '/add/:foodId',
  Interceptors.logged,
  controller.addFavouriteFood.bind(controller)
);
userRouter.patch(
  '/delete/:foodId',
  Interceptors.logged,
  controller.addFavouriteFood.bind(controller)
);
