import express from 'express';
import cors from 'cors';

import getMediaRouter from './routes/getMediaRouter';
import proxy from './routes/proxy';
import middleware from './middleware';

import https from 'https';
import fs from 'fs';

const expressApp = () => {
  const port = process.env.EXPRESS_PORT || 3000;
  const app = express();

  if (process.env.NODE_ENV === 'development')
    app.use(
      (cors as (options: cors.CorsOptions) => express.RequestHandler)({}),
    );

  app.use(express.json());
  app.use(express.static('./client'));
  app.use(middleware.errors);
  app.use('/api/getMedia', getMediaRouter);
  app.use('/api/proxy', proxy);

  const startNotice = () => () =>
    console.log(`Express is ready on port ${port}`);

  if (process.env.NODE_ENV === 'development') {
    const key = fs.readFileSync('../certs/rootCA-key.pem', 'utf8');
    const cert = fs.readFileSync('../certs/rootCA.pem', 'utf8');
    https.createServer({ key, cert }, app).listen(port, startNotice());
  } else {
    app.listen(port, startNotice());
  }
};

export default expressApp;
