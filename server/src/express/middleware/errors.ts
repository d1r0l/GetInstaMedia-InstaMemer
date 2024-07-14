import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';

const errors = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  errorHandler(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

export default errors;
