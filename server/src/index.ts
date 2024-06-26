import { igAgentStart } from './instagram/igAgent';
import discordApp from './discord/discordApp';
import expressApp from './express/expressApp';
import logConnectionIp from './utils/logConnectionIp';

console.log(`Starting server in ${process.env.NODE_ENV} mode`);
logConnectionIp();

igAgentStart();
discordApp();
expressApp();
