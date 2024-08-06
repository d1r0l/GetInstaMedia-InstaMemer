import { Client, GatewayIntentBits } from 'discord.js';
import { envMode, discordToken } from '../utils/config';

import messageHandler from './messageHandler';
import errorHandler from '../utils/errorHandler';

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
    if (msg.author?.id !== dcAgent.user?.id) {
      try {
        const channel = dcAgent.channels.cache.get(msg.channelId);
        if (!channel)
          throw new Error('Cannot find channel for incoming message.');
        if (!channel.isTextBased())
          throw new Error('Channel is not text based.');
        (() => {
          messageHandler(msg, channel).catch(errorHandler);
        })();
      } catch (error) {
        if (envMode === 'production') {
          if (error instanceof Error) console.error('Error: ' + error.message);
        } else console.error(error);
      }
    }
  });

  dcAgent.login(token).catch(errorHandler);
};

export default dcAgent;
