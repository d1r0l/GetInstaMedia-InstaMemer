import dotenv from 'dotenv';
import axios from 'axios';
import _ from 'lodash';
import sodium from 'libsodium-wrappers';
import crypto from 'node:crypto';
import {
  Cookies,
  updateCookiesFromSetHeader,
  getCookieHeader,
} from './cookiesParser';
import { PostData, isPostData } from './igAgentTypes';
import fs from 'fs';
dotenv.config();

const baseUrl = 'https://www.instagram.com';
const apiUrl = 'https://www.instagram.com/api/v1';
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Mobile/15E148 Instagram 142.0.0.22.109 ' +
  '(iPhone12,5; iOS 14_1; en_US; en-US; scale=3.00; 1242x2688; 214888322) NW/1';
let cookies: Cookies = {};
if (process.env.ENVIROMENT === 'development') {
  if (fs.existsSync('cookies.json'))
    cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8')) as Cookies;
}

const getPublicKeysData = async (): Promise<{
  csrfToken: string;
  publicKeyId: number;
  publicKey: string;
  publicKeyVersion: number;
}> => {
  const res = await axios({
    method: 'GET',
    url: `${apiUrl}/web/data/shared_data/`,
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
    const publicKeyId = Number(res.data.encryption.key_id);
    if (isNaN(publicKeyId)) throw new Error('Invalid public key id.');
    const publicKey = res.data.encryption.public_key;
    const publicKeyVersion = Number(res.data.encryption.version);
    if (isNaN(publicKeyVersion)) throw new Error('Invalid public key version.');

    return {
      csrfToken,
      publicKeyId,
      publicKey,
      publicKeyVersion,
    };
  } else throw new Error('Cannot get public keys data.');
};

const encryptPassword = async (
  pKeyId: number,
  pKey: string,
  pKeyVersion: number,
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

const isCookiesValid = async (): Promise<boolean> => {
  if (!cookies) return false;

  const res = await axios({
    url: `${apiUrl}/accounts/current_user/`,
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      Cookie: getCookieHeader(cookies),
    },
    validateStatus: () => true,
  });

  if (res.headers['set-cookie'])
    cookies = updateCookiesFromSetHeader(res.headers['set-cookie'], cookies);

  if (_.isObject(res.data) && 'status' in res.data && res.data.status === 'ok')
    return true;
  else return false;
};

const getIgCookies = async (): Promise<void> => {
  if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD)
    throw new Error('No Instagram username or password provided.');

  const keys = await getPublicKeysData();
  if (!keys) throw new Error('Cannot get public keys data.');

  const enc_password = await encryptPassword(
    keys.publicKeyId,
    keys.publicKey,
    keys.publicKeyVersion,
    process.env.IG_PASSWORD,
  );

  const req = {
    url: `${apiUrl}/web/accounts/login/ajax/`,
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
  if (res.status !== 200)
    throw new Error(`Cookies request status ${res.status}.`);
  if (res.data.status === 'fail')
    throw new Error('Response message: ' + res.data.message);
  if (!res.headers['set-cookie']) throw new Error('Cookies not found.');
  cookies = updateCookiesFromSetHeader(res.headers['set-cookie'], cookies);
  if (process.env.ENVIROMENT === 'development')
    fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
};

const getPostData = async (postShortCode: string): Promise<PostData> => {
  for (let i = 0; i < 2; i++) {
    if (await isCookiesValid()) break;
    await getIgCookies();
  }

  if (!postShortCode || postShortCode.length !== 11)
    throw new Error('Invalid post short code.');

  const res = await axios({
    url: `${baseUrl}/p/${postShortCode}/`,
    method: 'GET',
    params: {
      __a: 1,
      __d: 'dis',
    },
    headers: {
      'User-Agent': userAgent,
      Cookie: getCookieHeader(cookies),
    },
    validateStatus: () => true,
  });

  if (res.status !== 200)
    throw new Error(`Post data request status ${res.status}.`);
  if (res.headers['set-cookie'])
    cookies = updateCookiesFromSetHeader(res.headers['set-cookie'], cookies);
  if ('items' in res.data === false)
    throw new Error('Post response is invalid.');
  if (!_.isArray(res.data.items)) throw new Error('Post data is not an array.');
  if (res.data.items.length === 0) throw new Error('Post have no items.');
  const postData = res.data.items[0] as unknown;
  if (!isPostData(postData)) throw new Error('Post data is invalid type.');
  return postData;
};

const igAgent = {
  isCookiesValid,
  getIgCookies,
  getPostData,
};

export default igAgent;
