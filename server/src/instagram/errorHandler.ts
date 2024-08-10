import globalErrorHandler from '../utils/globalErrorHandler';
import { IgCheckpointError, IgLoginRequiredError } from 'instagram-private-api';
import { igAgentLoginFlow } from './igAgent';
import discordNotification from '../discord/notification';

let isCheckpointNotifySent = false;
let isReloginAttempted = false;

const errorHandler = (error: unknown) => {
  if (error instanceof Error) {
    switch (error.constructor) {
      case IgCheckpointError:
        if (!isCheckpointNotifySent) {
          discordNotification.sendToAdmin('IgCheckpointError occurred');
          isCheckpointNotifySent = true;
        }
        globalErrorHandler(error);
        break;
      case IgLoginRequiredError:
        if (!isReloginAttempted) {
          isReloginAttempted = true;
          console.log('IgLoginRequiredError occurred, trying to relogin');
          igAgentLoginFlow()
            .then(() => {
              isReloginAttempted = false;
            })
            .catch(errorHandler);
        }
        break;
      default:
        globalErrorHandler(error);
        break;
    }
  } else globalErrorHandler(error);
};

export default errorHandler;
