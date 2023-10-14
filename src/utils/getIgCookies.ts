import dotenv from 'dotenv';
import axios from 'axios';
import _ from 'lodash';
import sodium from 'libsodium-wrappers';
import crypto from 'node:crypto';
dotenv.config();

const baseurl = 'https://www.instagram.com/api/v1';
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Mobile/15E148 Instagram 142.0.0.22.109 ' +
  '(iPhone12,5; iOS 14_1; en_US; en-US; scale=3.00; 1242x2688; 214888322) NW/1';

const getPublicKeysData = async (): Promise<
  | {
      csrfToken: string;
      publicKeyId: string;
      publicKey: string;
      publicKeyVersion: string;
    }
  | undefined
> => {
  const res = await axios({
    method: 'GET',
    url: `${baseurl}/web/data/shared_data/`,
    headers: {
      'user-agent': userAgent,
    },
    validateStatus: () => true,
  });

  if (
    res.status === 200 &&
    _.isObject(res.data) &&
    'config' in res.data &&
    _.isObject(res.data.config) &&
    'csrf_token' in res.data.config &&
    _.isString(res.data.config.csrf_token) &&
    'encryption' in res.data &&
    _.isObject(res.data.encryption) &&
    'key_id' in res.data.encryption &&
    _.isString(res.data.encryption.key_id) &&
    'public_key' in res.data.encryption &&
    _.isString(res.data.encryption.public_key) &&
    'version' in res.data.encryption &&
    _.isString(res.data.encryption.version)
  ) {
    const csrfToken = res.data.config.csrf_token;
    const publicKeyId = res.data.encryption.key_id;
    const publicKey = res.data.encryption.public_key;
    const publicKeyVersion = res.data.encryption.version;
    return {
      csrfToken,
      publicKeyId,
      publicKey,
      publicKeyVersion,
    };
  } else {
    return undefined;
  }
};

const encryptPassword = async (
  pKeyId: string,
  pKey: string,
  pKeyVersion: string,
  pass: string,
): Promise<string> => {
  const time = Math.floor(Date.now() / 1000).toString();

  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
  const sealedKey = sodium.crypto_box_seal(
    Buffer.from(await crypto.subtle.exportKey('raw', key)),
    Buffer.from(pKey, 'hex'),
  );

  const sizeBuffer = Buffer.alloc(2, 0);
  sizeBuffer.writeInt16LE(sealedKey.byteLength, 0);

  const encPass = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: Buffer.alloc(12, 0),
      additionalData: Buffer.from(time, 'utf8'),
    },
    key,
    Buffer.from(pass, 'utf8'),
  );

  const payload = Buffer.concat([
    Buffer.alloc(1, 1),
    Buffer.alloc(1, pKeyId),
    Buffer.from(sizeBuffer),
    Buffer.from(sealedKey),
    Buffer.from(encPass, Buffer.from(encPass).length - 16, 16),
    Buffer.from(encPass, 0, Buffer.from(encPass).length - 16),
  ]).toString('base64');

  const result = ['#PWD_INSTAGRAM_BROWSER', pKeyVersion, time, payload].join(
    ':',
  );
  return result;
};

const getIgCookies = async () => {
  if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD)
    throw new Error('No Instagram username or password provided.');

  const url = `${baseurl}/web/accounts/login/ajax/`;
  const keys = await getPublicKeysData();
  if (!keys) throw new Error('Cannot get public keys data.');

  const enc_password = await encryptPassword(
    keys.publicKeyId,
    keys.publicKey,
    keys.publicKeyVersion,
    process.env.IG_PASSWORD,
  );

  const req = {
    url: url,
    method: 'POST',
    headers: {
      'User-Agent': userAgent,
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `csrftoken=${keys.csrfToken}`,
      'X-Csrftoken': keys.csrfToken,
    },
    data: {
      enc_password: enc_password,
      optIntoOneTap: false,
      queryParams: '{}',
      trustedDeviceRecords: '{}',
      username: process.env.IG_USERNAME,
    },
    validateStatus: () => true,
  };

  const res = await axios(req);
  if (res.status !== 200) throw new Error('Cannot get Instagram cookies.');
  if (!res.headers['set-cookie']) throw new Error('Cookies not found.');
  const cookies = res.headers['set-cookie'];
  console.log(cookies);
};

export default getIgCookies;
