import { igApiClientExtended } from './agent/igApiClientExtended';
import { igCredentials, proxyUrl } from '../utils/config';
import errorHandler from '../utils/errorHandler';

const igAgent = new igApiClientExtended();

const login = async () => {
  if (!igCredentials)
    throw new Error('No Instagram username or password provided');

  igAgent.session.load();
  igAgent.state.generateDevice(igCredentials.username);

  if (proxyUrl) igAgent.state.proxyUrl = proxyUrl;

  await igAgent.simulate.preLoginFlow();

  const loggedInUser = await igAgent.account.login(
    igCredentials.username,
    igCredentials.password,
  );

  if (!loggedInUser) throw new Error('Cannot login to Instagram');
  else console.log(`Logged in as ${loggedInUser.username}`);

  igAgent.session.save();

  igAgent.request.end$.subscribe(() => igAgent.session.save());

  process.nextTick(() =>
    igAgent.simulateAddon.postLoginFlow().catch(errorHandler),
  );
};

/**
 * Executes the login process and handles any errors that occur.
 *
 * @return {Promise<void>} A promise that resolves when the login process is complete.
 */
const igAgentStart = () => {
  login().catch(errorHandler);
};

export { igAgentStart };
export default igAgent;
