import express from 'express';
import cors from 'cors';

import getMediaRouter from './routes/getMediaRouter';
import loadCorsMediaRouter from './routes/loadCorsMediaRouter';
import middleware from './utils/middleware';

import https from 'https';
import fs from 'fs';

const app = () => {
  const port = process.env.EXPRESS_PORT || 3000;
  const expressApp = express();

  if (process.env.NODE_ENV === 'development')
    expressApp.use(
      (cors as (options: cors.CorsOptions) => express.RequestHandler)({}),
    );

  expressApp.use(express.json());
  expressApp.use(express.static('./client'));
  expressApp.use(middleware.errorHandler);
  expressApp.use('/api/getMedia', getMediaRouter);
  expressApp.use('/api/proxy', loadCorsMediaRouter);

  const startNotice = () => () =>
    console.log(`Express is ready on port ${port}`);

  if (process.env.NODE_ENV === 'development') {
    const key = fs.readFileSync('../certs/rootCA-key.pem', 'utf8');
    const cert = fs.readFileSync('../certs/rootCA.pem', 'utf8');
    https.createServer({ key, cert }, expressApp).listen(port, startNotice());
  } else {
    expressApp.listen(port, startNotice());
  }
};

export default app;
