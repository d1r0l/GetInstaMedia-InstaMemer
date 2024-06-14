import { IgApiClient } from 'instagram-private-api';
import errorHandler from '../utils/errorHandler';

const igAgent = new IgApiClient();

const login = async () => {
  if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD)
    throw new Error('No Instagram username or password provided.');

  igAgent.state.generateDevice(process.env.IG_USERNAME);

  await igAgent.simulate.preLoginFlow();

  const loggedInUser = await igAgent.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD,
  );

  if (!loggedInUser) throw new Error('Cannot login to Instagram.');
  else console.log(`Logged in as ${loggedInUser.username}.`);

  process.nextTick(
    async () => await igAgent.simulate.postLoginFlow().catch(errorHandler),
  );
};

const igAgentStart = () => {
  login().catch(errorHandler);
};

export { igAgentStart };
export default igAgent;
