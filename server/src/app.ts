import express from 'express';
import getMediaRouter from './routes/getMediaRouter';
import loadCorsMediaRouter from './routes/loadCorsMediaRouter';
import middleware from './utils/middleware';
import cors from 'cors';

console.log(`Current environment: ${process.env.NODE_ENV}.`);

const app = express();

process.env.NODE_ENV === 'development'
  ? app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}))
  : null;

app.use(express.json());
app.use(express.static('./client'));
app.use(middleware.errorHandler);

app.use('/api/getMedia', getMediaRouter);
app.use('/api/proxy', loadCorsMediaRouter);

export default app;
