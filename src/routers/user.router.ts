import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repository/user.mongo.repo.js';

export const userRouter = Router();

const repoUsers = new UsersMongoRepo();
const controller = new UsersController(repoUsers);

userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
