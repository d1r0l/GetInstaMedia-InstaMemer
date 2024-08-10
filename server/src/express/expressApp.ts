import express from 'express';
import 'express-async-errors';
import { envMode, expressPort } from '../utils/config';
import cors from 'cors';
import getMediaRouter from './routes/getMediaRouter';
import proxy from './routes/proxy';
import errorHandler from './middleware/errorHandler';
import https from 'https';
import fs from 'fs';

const expressApp = express();

/**
 * Creates an Express application and sets up middleware and routes for serving static files,
 * handling JSON requests, and proxying requests to other endpoints. If the environment mode
 * is set to 'development', CORS is enabled for all requests. The application listens on the
 * specified port and logs a message when it is ready. If the environment mode is set to
 * 'development', the application also serves HTTPS requests using a self-signed certificate.
 */
export const expressAppStart = (): void => {
  if (envMode === 'development')
    expressApp.use(
      (cors as (options: cors.CorsOptions) => express.RequestHandler)({}),
    );

  expressApp.use(express.json());
  expressApp.use(express.static('./client'));
  expressApp.use('/api/getMedia', getMediaRouter);
  expressApp.use('/api/proxy', proxy);

  expressApp.use(errorHandler);

  const startNotice = () => () => {
    console.log(`Express is ready on port ${expressPort}`);
  };

  if (envMode === 'development') {
    const key = fs.readFileSync('../certs/rootCA-key.pem', 'utf8');
    const cert = fs.readFileSync('../certs/rootCA.pem', 'utf8');
    https
      .createServer({ key, cert }, expressApp)
      .listen(expressPort, startNotice());
  } else {
    expressApp.listen(expressPort, startNotice());
  }
};

export default expressApp;
