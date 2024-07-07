import { Repository } from 'instagram-private-api/dist/core/repository';
import { resolve } from 'path';
import fs from 'fs';

export class Session extends Repository {
  public cookiesDirPath = resolve(process.cwd(), 'cookies');
  private cookiesPath = resolve(this.cookiesDirPath, 'state.json');
  private isSaveExists =
    fs.existsSync(this.cookiesDirPath) && fs.existsSync(this.cookiesPath);

  public save = () => {
    if (!fs.existsSync(this.cookiesDirPath)) fs.mkdirSync(this.cookiesDirPath);
    this.client.state
      .serialize()
      .then((state) => {
        if ('constants' in state) delete state.constants;
        fs.writeFileSync(this.cookiesPath, JSON.stringify(state));
      })
      .catch((_error) => console.log('State save failed'));
  };

  public load = () => {
    if (this.isSaveExists) {
      this.client.state
        .deserialize(fs.readFileSync(this.cookiesPath))
        .then(() => console.log('State loaded successfully'))
        .catch((_error) => console.log('State load failed'));
    } else {
      console.log('State not found');
    }
  };
}
