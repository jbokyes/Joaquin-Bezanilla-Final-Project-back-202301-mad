import createDebug from 'debug';
import morgan from 'morgan';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { userRouter } from './routers/user.router.js';
import { errorsMiddleware } from './middlewares/errors.middlewares.js';

const debug = createDebug('latino-foods:app');
debug('holaa');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use('/users', userRouter);
app.get('/', (_req, resp) => {
  resp.json({
    info: "Bootcamp API's",
    endpoints: {
      foods: '/foods',
      users: '/users',
    },
  });
});
app.use(errorsMiddleware);
