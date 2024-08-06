import dcAgent from './dcAgent';
import { discordAdminUserId } from '../utils/config';
import errorHandler from '../utils/errorHandler';

const sendToAdmin = (message: string) => {
  if (discordAdminUserId) {
    dcAgent.users
      .createDM(discordAdminUserId)
      .then((channel) => channel.send(message))
      .catch(errorHandler);
  }
};

const discordNotification = { sendToAdmin };
export default discordNotification;
