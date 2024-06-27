import { nanoid } from 'nanoid';
import { envMode } from '../utils/config';
import fs from 'fs';

const errorHandler = (error: unknown) => {
  if (envMode === 'production') {
    if (error instanceof Error)
      console.error(`Error ${error.name}: ${error.message}`);
    else console.log('Something went wrong.');
  } else {
    if (error instanceof Error) {
      const errorId = nanoid();

      console.error(`Error ${error.name}: ${errorId}`);

      const filename = `${error.name}_${errorId}.txt`;

      let parsedError = `${error.name}\n${error.message}`;
      if (error.stack) parsedError += `\n${error.stack}`;

      if (!fs.existsSync('./errors')) fs.mkdirSync('./errors');
      fs.writeFileSync(`./errors/${filename}`, parsedError);
    }
  }
};

export default errorHandler;
