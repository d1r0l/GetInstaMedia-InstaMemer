import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
dotenv.config();

const bot = async () => {
  const token = process.env.DISCORD_TOKEN;
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('ready', () => {
    console.log('Discord bot is ready');
  });

  if (token) {
    try {
      await client.login(token);
    } catch {
      console.log('Error: could not login to Discord!');
    }
  } else console.log('Error: no Discord token provided!');
};

export default bot;
