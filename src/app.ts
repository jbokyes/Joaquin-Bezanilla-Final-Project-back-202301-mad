import createDebug from 'debug';
import morgan from 'morgan';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

const debug = createDebug('Latino:app');
debug('Latino:app');
export const app = express();
app.disable('x-powered-by');
const corsOptions = {
  origin: '*',
};

app.get('/', (_req, resp) => {
  resp.json({
    info: "Bootcamp API's",
    endpoints: {
      things: '/things',
      users: '/users',
    },
  });
});
