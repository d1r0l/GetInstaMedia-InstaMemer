import express from 'express';
import { envMode, expressPort } from '../utils/config';
import cors from 'cors';
import getMediaRouter from './routes/getMediaRouter';
import proxy from './routes/proxy';
import errors from './middleware/errors';
import https from 'https';
import fs from 'fs';

const expressApp = () => {
  const port = expressPort;
  const app = express();

  if (envMode === 'development')
    app.use(
      (cors as (options: cors.CorsOptions) => express.RequestHandler)({}),
    );

  app.use(express.json());
  app.use(express.static('./client'));
  app.use(errors);
  app.use('/api/getMedia', getMediaRouter);
  app.use('/api/proxy', proxy);

  const startNotice = () => () =>
    console.log(`Express is ready on port ${port}`);

  if (envMode === 'development') {
    const key = fs.readFileSync('../certs/rootCA-key.pem', 'utf8');
    const cert = fs.readFileSync('../certs/rootCA.pem', 'utf8');
    https.createServer({ key, cert }, app).listen(port, startNotice());
  } else {
    app.listen(port, startNotice());
  }
};

export default expressApp;
