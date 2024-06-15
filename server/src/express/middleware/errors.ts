import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';

const errors = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  errorHandler(err);
  next(err);
};

export default errors;
