import { nanoid } from 'nanoid';
import { envMode } from '../utils/config';

const errorHandler = (error: unknown) => {
  if (envMode === 'production') {
    if (error instanceof Error) console.error('Error: ' + error.name);
    else console.log('Something went wrong.');
  } else {
    if (error instanceof Error) {
      const errorId = nanoid();
      console.error(`<========== Error ${errorId} start ==========>`);
      console.error(error);
      console.error(`<=========== Error ${errorId} end ===========>`);
    }
  }
};

export default errorHandler;
