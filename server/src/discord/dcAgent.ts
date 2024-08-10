import { Client, GatewayIntentBits } from 'discord.js';
import { discordToken } from '../utils/config';

import messageHandler from './messageHandler';
import errorHandler from './errorHandler';

const dcAgent = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/**
 * Initializes and starts a Discord client.
 */
export const dcAgentStart = (): void => {
  const token = discordToken;

  dcAgent.on('error', errorHandler);

  dcAgent.on('ready', () => {
    console.log('Discord bot is ready');
  });

  dcAgent.on('messageCreate', (msg) => {
    if (msg.author.id !== dcAgent.user?.id)
      messageHandler(msg).catch(errorHandler);
  });

  dcAgent.login(token).catch(errorHandler);
};

export default dcAgent;
