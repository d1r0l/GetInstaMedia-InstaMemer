import globalErrorHandler from '../utils/globalErrorHandler';

const errorHandler = (error: unknown): void => {
  globalErrorHandler(error);
};

export default errorHandler;
