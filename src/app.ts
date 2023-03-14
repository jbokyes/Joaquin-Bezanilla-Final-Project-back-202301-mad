import createDebug from 'debug';
import morgan from 'morgan';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { userRouter } from './routers/user.router.js';

const debug = createDebug('Latino:app');
debug('Latino:app');
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
      things: '/things',
      users: '/users',
    },
  });
});
