import startupLogger from './utils/startupLogger';
import { igAgentStart } from './instagram/igAgent';
import { dcAgentStart } from './discord/dcAgent';
import expressApp from './express/expressApp';

startupLogger();

igAgentStart();
dcAgentStart();
expressApp();
