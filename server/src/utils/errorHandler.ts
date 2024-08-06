import { nanoid } from 'nanoid';
import { envMode } from '../utils/config';
import { resolve } from 'path';
import fs from 'fs';
import discordNotification from '../discord/notification';

let isIgCheckpointErrorOccurred = false;

const errorHandler = (error: unknown) => {
  if (envMode === 'production') {
    if (error instanceof Error)
      console.error(`Error ${error.name}: ${error.message}`);
    else console.log('Something went wrong.');
  } else {
    if (error instanceof Error) {
      if (error.name === 'IgCheckpointError' && !isIgCheckpointErrorOccurred) {
        isIgCheckpointErrorOccurred = true;
        discordNotification.sendToAdmin('IgCheckpointError occurred');
      }
      const errorsDirPath = resolve(process.cwd(), 'errors');
      const errorId = nanoid();
      const filename = `${error.name}_${errorId}.txt`;

      console.error(`Error ${error.name}: ${errorId}`);

      let parsedError = `${error.name}\n${error.message}`;
      if (error.stack) parsedError += `\n${error.stack}`;
      if (!fs.existsSync(errorsDirPath)) fs.mkdirSync(errorsDirPath);
      fs.writeFileSync(errorsDirPath + '/' + filename, parsedError);
    }
  }
};

export default errorHandler;
