import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (process.env.NODE_ENV === 'production') {
    if (err instanceof Error) console.error('Error: ' + err.message);
  } else console.error(err);
  next(err);
};

export default { errorHandler };
