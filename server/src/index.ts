import startupLogger from './utils/startupLogger';
import { igAgentStart } from './instagram/igAgent';
import discordApp from './discord/discordApp';
import expressApp from './express/expressApp';

startupLogger();

igAgentStart();
discordApp();
expressApp();
