import { nanoid } from 'nanoid';

const errorHandler = (error: unknown) => {
  if (process.env.NODE_ENV === 'production') {
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
