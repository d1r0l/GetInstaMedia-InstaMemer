import { Client, GatewayIntentBits } from 'discord.js';
import { envMode, discordToken } from '../utils/config';

import messageHandler from '../discord/messageHandler';
import errorHandler from '../utils/errorHandler';

/**
 * Initializes and starts a Discord bot.
 *
 * @return {void} This function does not return anything.
 */
const bot = () => {
  const token = discordToken;
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('error', errorHandler);

  client.on('ready', () => {
    console.log('Discord bot is ready');
  });

  client.on('messageCreate', (msg) => {
    if (msg.author?.id !== client.user?.id) {
      try {
        const channel = client.channels.cache.get(msg.channelId);
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

  client.login(token).catch(errorHandler);
};

export default bot;
