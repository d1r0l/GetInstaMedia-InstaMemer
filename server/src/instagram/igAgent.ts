import { IgApiClientExtended } from './agent/IgApiClientExtended';
import { igCredentials, proxyUrl } from '../utils/config';
import errorHandler from './errorHandler';

const igAgent = new IgApiClientExtended();

const igAgentLoginFlow = async () => {
  if (!igCredentials)
    throw new Error('No Instagram username or password provided');

  await igAgent.simulate.preLoginFlow();
  const currentUser = await igAgent.account.login(
    igCredentials.username,
    igCredentials.password,
  );
  if (currentUser) console.log(`Logged in as ${currentUser.username}`);
  else throw new Error('Cannot login to Instagram');
  await igAgent.simulateAddon.postLoginFlow();
};

const igAgentStartFlow = async () => {
  if (proxyUrl) igAgent.state.proxyUrl = proxyUrl;

  if (!igCredentials)
    throw new Error('No Instagram username or password provided');

  igAgent.state.generateDevice(igCredentials.username);

  await igAgent.session.load();
  const loadedUser = await igAgent.account.currentUser().catch(() => null);
  if (loadedUser)
    console.log(`Logged in as ${loadedUser.username} with existing session`);
  else {
    console.log('Loaded session is invalid, signing in normally');

    await igAgent.session.clear();
    await igAgentLoginFlow();
    igAgent.session.save();
  }

  igAgent.request.end$.subscribe({
    next: () => {
      igAgent.session.save();
    },
  });

  igAgent.session.maintain();
};

/**
 * Initializes and starts a Instagram client.
 */
const igAgentStart = (): void => {
  igAgentStartFlow().catch(errorHandler);
};

export { igAgentStart, igAgentLoginFlow };
export default igAgent;
