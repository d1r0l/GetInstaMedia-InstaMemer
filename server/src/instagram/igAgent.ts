import { igApiClientExtended } from './agent/igApiClientExtended';
import { igCredentials, proxyUrl } from '../utils/config';
import errorHandler from '../utils/errorHandler';

const igAgent = new igApiClientExtended();

const login = async () => {
  if (!igCredentials)
    throw new Error('No Instagram username or password provided');

  if (proxyUrl) igAgent.state.proxyUrl = proxyUrl;

  igAgent.state.generateDevice(igCredentials.username);

  await igAgent.session.load();
  const loadedUser = await igAgent.account.currentUser().catch(() => null);
  if (loadedUser)
    console.log(`Logged in as ${loadedUser.username} with existing session`);
  else {
    console.log('Loaded session is invalid, signing in normally');

    await igAgent.session.clear();
    await igAgent.simulate.preLoginFlow();
    const currentUser = await igAgent.account.login(
      igCredentials.username,
      igCredentials.password,
    );
    if (currentUser) console.log(`Logged in as ${currentUser.username}`);
    else throw new Error('Cannot login to Instagram');
    await igAgent.simulateAddon.postLoginFlow();
    igAgent.session.save();
  }

  igAgent.request.end$.subscribe({
    next: () => {
      igAgent.session.save();
    },
  });

  const sessionMaintaining = () => {
    setTimeout(
      () => {
        igAgent.account.currentUser().catch(errorHandler);
        sessionMaintaining();
      },
      (30 + 30 * Math.random()) * 60 * 1000,
    );
  };

  sessionMaintaining();
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
