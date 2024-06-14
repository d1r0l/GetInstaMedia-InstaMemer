import { igAgentStart } from './instagram/igAgent';
import discordApp from './discord/discordApp';
import expressApp from './express/expressApp';

console.log(`Starting server in ${process.env.NODE_ENV} mode`);

igAgentStart();
discordApp();
expressApp();
