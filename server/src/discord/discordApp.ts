import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

import messageHandler from '../discord/messageHandler';
import errorHandler from '../utils/errorHandler';

dotenv.config();

const bot = () => {
  const token = process.env.DISCORD_TOKEN;
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
        if (process.env.NODE_ENV === 'production') {
          if (error instanceof Error) console.error('Error: ' + error.message);
        } else console.error(error);
      }
    }
  });

  client.login(token).catch(errorHandler);
};

export default bot;
