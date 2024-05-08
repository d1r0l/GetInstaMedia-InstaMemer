import bot from './bot';
import app from './app';

console.log(`Starting server in ${process.env.NODE_ENV} mode`);

bot().catch(console.error);
app();
