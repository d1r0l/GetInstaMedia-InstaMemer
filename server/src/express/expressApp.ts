import express from 'express';
import 'express-async-errors';
import { envMode, expressPort } from '../utils/config';
import cors from 'cors';
import getMediaRouter from './routes/getMediaRouter';
import proxy from './routes/proxy';
import errors from './middleware/errors';
import https from 'https';
import fs from 'fs';

/**
 * Creates an Express application and sets up middleware and routes for serving static files,
 * handling JSON requests, and proxying requests to other endpoints. If the environment mode
 * is set to 'development', CORS is enabled for all requests. The application listens on the
 * specified port and logs a message when it is ready. If the environment mode is set to
 * 'development', the application also serves HTTPS requests using a self-signed certificate.
 */
const expressApp = (): void => {
  const port = expressPort;
  const app = express();

  if (envMode === 'development')
    app.use(
      (cors as (options: cors.CorsOptions) => express.RequestHandler)({}),
    );

  app.use(express.json());
  app.use(express.static('./client'));
  app.use('/api/getMedia', getMediaRouter);
  app.use('/api/proxy', proxy);

  app.use(errors);

  const startNotice = () => () => {
    console.log(`Express is ready on port ${port}`);
  };

  if (envMode === 'development') {
    const key = fs.readFileSync('../certs/rootCA-key.pem', 'utf8');
    const cert = fs.readFileSync('../certs/rootCA.pem', 'utf8');
    https.createServer({ key, cert }, app).listen(port, startNotice());
  } else {
    app.listen(port, startNotice());
  }
};

export default expressApp;
