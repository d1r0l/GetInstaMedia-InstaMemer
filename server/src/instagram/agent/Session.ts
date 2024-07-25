import { Repository } from 'instagram-private-api/dist/core/repository';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import { resolve } from 'path';
import fs from 'fs';

interface SessionData {
  constants?: {
    [key: string]: string;
  };
  cookies: string;
  supportedCapabilities: {
    name: string;
    value: string;
  }[];
  language: string;
  timezoneOffset: string;
  radioType: string;
  capabilitiesHeader: string;
  connectionTypeHeader: string;
  isLayoutRTL: boolean;
  euDCEnabled?: boolean;
  adsOptOut: boolean;
  thumbnailCacheBustingValue: number;
  clientSessionIdLifetime: number;
  pigeonSessionIdLifetime: number;
  deviceString: string;
  deviceId: string;
  uuid: string;
  phoneId: string;
  adid: string;
  build: string;
  igWWWClaim?: string;
  passwordEncryptionKeyId?: string | number;
  passwordEncryptionPubKey?: string;
  authorization?: string;
}

const isSessionData = (data: unknown): data is SessionData => {
  if (
    !data ||
    !isObject(data) ||
    !('cookies' in data) ||
    !isString(data.cookies) ||
    !('supportedCapabilities' in data) ||
    !isArray(data.supportedCapabilities) ||
    !('language' in data) ||
    !isString(data.language) ||
    !('timezoneOffset' in data) ||
    !isString(data.timezoneOffset) ||
    !('radioType' in data) ||
    !isString(data.radioType) ||
    !('capabilitiesHeader' in data) ||
    !isString(data.capabilitiesHeader) ||
    !('connectionTypeHeader' in data) ||
    !isString(data.connectionTypeHeader) ||
    !('isLayoutRTL' in data) ||
    !isBoolean(data.isLayoutRTL) ||
    !('adsOptOut' in data) ||
    !isBoolean(data.adsOptOut) ||
    !('thumbnailCacheBustingValue' in data) ||
    !isNumber(data.thumbnailCacheBustingValue) ||
    !('clientSessionIdLifetime' in data) ||
    !isNumber(data.clientSessionIdLifetime) ||
    !('pigeonSessionIdLifetime' in data) ||
    !isNumber(data.pigeonSessionIdLifetime) ||
    !('deviceString' in data) ||
    !isString(data.deviceString) ||
    !('deviceId' in data) ||
    !isString(data.deviceId) ||
    !('uuid' in data) ||
    !isString(data.uuid) ||
    !('phoneId' in data) ||
    !isString(data.phoneId) ||
    !('adid' in data) ||
    !isString(data.adid) ||
    !('build' in data) ||
    !isString(data.build) ||
    !('igWWWClaim' in data)
  )
    return false;

  if ('constants' in data && !isObject(data.constants)) return false;

  for (const capablity of data.supportedCapabilities) {
    if (
      !isObject(capablity) ||
      !('name' in capablity) ||
      !isString(capablity.name) ||
      !('value' in capablity) ||
      !(isString(capablity.value) || isNumber(capablity.value))
    )
      return false;
  }

  if ('euDCEnabled' in data && !isBoolean(data.euDCEnabled)) return false;

  if ('igWWWClaim' in data && !isString(data.igWWWClaim)) return false;

  if (
    'passwordEncryptionKeyId' in data &&
    !(
      isString(data.passwordEncryptionKeyId) ||
      isNumber(data.passwordEncryptionKeyId)
    )
  )
    return false;

  if (
    'passwordEncryptionPubKey' in data &&
    !isString(data.passwordEncryptionPubKey)
  )
    return false;

  if ('authorization' in data && !isString(data.authorization)) return false;
  return true;
};

export class Session extends Repository {
  public sessionDirPath = resolve(process.cwd(), 'session');
  private sessionPath = resolve(this.sessionDirPath, 'session.json');
  private isSavingCurrently: boolean = false;
  private isSaveExists =
    fs.existsSync(this.sessionDirPath) && fs.existsSync(this.sessionPath);

  private saveRoutine = async () => {
    this.isSavingCurrently = true;
    if (!fs.existsSync(this.sessionDirPath)) fs.mkdirSync(this.sessionDirPath);
    const sessionData = (await this.client.state.serialize()) as SessionData;
    if ('constants' in sessionData) delete sessionData.constants;
    fs.writeFileSync(this.sessionPath, JSON.stringify(sessionData), 'utf-8');
  };

  public save = () => {
    if (this.isSavingCurrently) return;
    this.saveRoutine()
      .catch(() => console.log('Session saving failed'))
      .finally(() => (this.isSavingCurrently = false));
  };

  public load = async () => {
    if (!this.isSaveExists) {
      console.log('Session not found');
      return;
    }

    const sessionData = JSON.parse(
      fs.readFileSync(this.sessionPath, 'utf-8'),
    ) as unknown;

    if (!sessionData || !isSessionData(sessionData)) {
      console.log('Session data is corrupted');
      return;
    }
    await this.client.state.deserialize(sessionData);
    this.client.state.igWWWClaim = sessionData.igWWWClaim;
    this.client.state.passwordEncryptionKeyId =
      sessionData.passwordEncryptionKeyId;
    this.client.state.passwordEncryptionPubKey =
      sessionData.passwordEncryptionPubKey;
    this.client.state.authorization = sessionData.authorization;
    console.log('Session loaded successfully');
  };

  public clear = async () => {
    await this.client.state.deserialize({});
    delete this.client.state.igWWWClaim;
    delete this.client.state.passwordEncryptionKeyId;
    delete this.client.state.passwordEncryptionPubKey;
    delete this.client.state.authorization;
  };
}
