import { NextFunction, Request, Response } from 'express';
import globalErrorHandler from '../../utils/globalErrorHandler';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(500).json({ error: 'Internal Server Error' });
  globalErrorHandler(err);
};

export default errorHandler;
