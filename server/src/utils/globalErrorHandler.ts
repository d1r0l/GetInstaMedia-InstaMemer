import { nanoid } from 'nanoid';
import { envMode } from './config';
import { resolve } from 'path';
import fs from 'fs';

const globalErrorHandler = (error: unknown) => {
  if (error instanceof Error) {
    if (envMode === 'production') {
      console.error(`Error ${error.name}: ${error.message}`);
    } else {
      const errorsDirPath = resolve(process.cwd(), 'errors');
      const errorId = nanoid();
      const filename = `${error.name}_${errorId}.txt`;

      console.error(`Error ${error.name}: ${errorId}`);

      let parsedError = `${error.name}\n${error.message}`;
      if (error.stack) parsedError += `\n${error.stack}`;
      if (!fs.existsSync(errorsDirPath)) fs.mkdirSync(errorsDirPath);
      fs.writeFileSync(errorsDirPath + '/' + filename, parsedError);
    }
  } else console.log('Something went wrong:', error);
};

export default globalErrorHandler;
