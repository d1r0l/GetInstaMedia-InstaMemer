import bot from './bot';
import getIgCookies from './utils/getIgCookies';

getIgCookies().catch(console.error);

bot().catch(console.error);
