import { envMode } from './utils/config';
import { igAgentStart } from './instagram/igAgent';
import discordApp from './discord/discordApp';
import expressApp from './express/expressApp';
import logConnectionIp from './utils/logConnectionIp';

console.log(`Starting server in ${envMode} mode`);
logConnectionIp();

igAgentStart();
discordApp();
expressApp();
