import { IgApiClient } from 'instagram-private-api';

import { SimulateServiceAddon } from './SimulateServiceAddon';
import { Session } from './Session';

export class igApiClientExtended extends IgApiClient {
  public simulateAddon = new SimulateServiceAddon(this);
  public session = new Session(this);
}
