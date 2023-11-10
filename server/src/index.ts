import dotenv from 'dotenv';
import bot from './bot';
dotenv.config();

console.log(`Current environment: ${process.env.NODE_ENV}.`);

bot().catch(console.error);
