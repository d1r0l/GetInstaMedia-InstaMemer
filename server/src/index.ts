import startupLogger from './utils/startupLogger';
import { igAgentStart } from './instagram/igAgent';
import { dcAgentStart } from './discord/dcAgent';
import { expressAppStart } from './express/expressApp';

startupLogger();

igAgentStart();
dcAgentStart();
expressAppStart();
