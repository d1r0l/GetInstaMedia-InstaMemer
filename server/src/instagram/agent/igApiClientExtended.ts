import { IgApiClient } from 'instagram-private-api';
import { SimulateServiceAddon } from './SimulateServiceAddon';
import { Session } from './Session';

export class IgApiClientExtended extends IgApiClient {
  public simulateAddon = new SimulateServiceAddon(this);
  public session = new Session(this);
}
