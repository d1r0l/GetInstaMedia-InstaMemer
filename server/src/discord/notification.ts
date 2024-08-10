import dcAgent from './dcAgent';
import { discordAdminUserId } from '../utils/config';
import globalErrorHandler from '../utils/globalErrorHandler';

const sendToAdmin = (message: string) => {
  if (discordAdminUserId) {
    dcAgent.users
      .createDM(discordAdminUserId)
      .then((channel) => channel.send(message))
      .catch(globalErrorHandler);
  }
};

const discordNotification = { sendToAdmin };
export default discordNotification;
