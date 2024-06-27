import { Client, GatewayIntentBits } from 'discord.js';
import messageHandler from './messageHandler';
import { envMode, discordToken } from '../utils/config';

const bot = async () => {
  const token = discordToken;
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('ready', () => {
    console.log('Discord bot is ready.');
  });

  client.on('messageCreate', async (msg) => {
    if (msg.author?.id !== client.user?.id) {
      try {
        const channel = client.channels.cache.get(msg.channelId);
        if (!channel)
          throw new Error('Cannot find channel for incoming message.');
        if (!channel.isTextBased())
          throw new Error('Channel is not text based.');
        await messageHandler(msg, channel);
      } catch (error) {
        if (envMode !== 'production') {
          if (error instanceof Error) console.error('Error: ' + error.message);
        } else console.error(error);
      }
    }
  });

  try {
    if (!token) throw new Error('No Discord token provided.');
    await client.login(token);
  } catch (error) {
    if (envMode !== 'production') {
      if (error instanceof Error) console.error('Error: ' + error.message);
    } else console.error(error);
  }
};

export default bot;
