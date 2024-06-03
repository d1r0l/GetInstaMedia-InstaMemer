import crypto from 'node:crypto';
import fs from 'fs';

import dotenv from 'dotenv';
import axios from 'axios';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import sodium from 'libsodium-wrappers';

import {
  Cookies,
  updateCookiesFromSetHeader,
  getCookieHeader,
} from './cookiesParser';
import { PostData, isPostData } from './igAgentTypes';

dotenv.config();

const baseUrl = 'https://www.instagram.com';
const apiUrl = 'https://www.instagram.com/api/v1';
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Mobile/15E148 Instagram 142.0.0.22.109 ' +
  '(iPhone12,5; iOS 14_1; en_US; en-US; scale=3.00; 1242x2688; 214888322) NW/1';
let cookies: Cookies = {};

if (process.env.NODE_ENV === 'development') {
  if (fs.existsSync('cookies/igCookies.json'))
    cookies = JSON.parse(
      fs.readFileSync('cookies/igCookies.json', 'utf8'),
    ) as Cookies;
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
    maxRedirects: 0,
    validateStatus: () => true,
  });

  if (
    res.status !== 200 ||
    !isObject(res.data) ||
    !('config' in res.data) ||
    !isObject(res.data.config) ||
    !('csrf_token' in res.data.config) ||
    !isString(res.data.config.csrf_token) ||
    !('encryption' in res.data) ||
    !isObject(res.data.encryption) ||
    !('key_id' in res.data.encryption) ||
    !isString(res.data.encryption.key_id) ||
    !('public_key' in res.data.encryption) ||
    !isString(res.data.encryption.public_key) ||
    !('version' in res.data.encryption) ||
    !isString(res.data.encryption.version)
  )
    throw new Error('Cannot get public keys data.');

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
    maxRedirects: 0,
    validateStatus: () => true,
  });

  if (res.headers['set-cookie'])
    cookies = updateCookiesFromSetHeader(res.headers['set-cookie'], cookies);

  if (isObject(res.data) && 'status' in res.data && res.data.status === 'ok')
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
    maxRedirects: 0,
    validateStatus: () => true,
  };

  const res = await axios(req);

  if (res.status !== 200) {
    if ('message' in res.data)
      throw new Error(
        `Cookies request status ${res.status}. ` +
          'Response message: ' +
          res.data.message,
      );
    throw new Error(`Cookies request status ${res.status}.`);
  }
  if (res.data.status === 'fail')
    throw new Error('Response message: ' + res.data.message);
  if (!res.headers['set-cookie']) throw new Error('Cookies not found.');

  cookies = updateCookiesFromSetHeader(res.headers['set-cookie'], cookies);

  if (process.env.NODE_ENV !== 'production')
    fs.writeFileSync(
      'cookies/igCookies.json',
      JSON.stringify(cookies, null, 2),
    );
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
    maxRedirects: 0,
    validateStatus: () => true,
  });

  if (res.status !== 200)
    throw new Error(`Post data request status ${res.status}.`);

  if (res.headers['set-cookie'])
    cookies = updateCookiesFromSetHeader(res.headers['set-cookie'], cookies);

  if ('items' in res.data === false) {
    if ('description' in res.data)
      throw new Error('Post response message: ' + res.data.description);
    else throw new Error('Post response is invalid.');
  }
  if (!isArray(res.data.items)) throw new Error('Post data is not an array.');
  if (res.data.items.length === 0) throw new Error('Post have no items.');

  const postData = res.data.items[0] as unknown;

  if (!isPostData(postData)) throw new Error('Post data is invalid type.');

  return postData;
};

const mediaUrlArraySelector = async (
  postData: PostData,
  maxSize?: number,
): Promise<string[]> => {
  const isMediaValidSize = (mediaSize: string): boolean => {
    if (
      parseInt(mediaSize) &&
      parseInt(mediaSize) !== 0 &&
      parseInt(mediaSize) <= (maxSize ? maxSize : Infinity)
    )
      return true;
    else return false;
  };

  const sizeError = new Error('Media size is too large.');
  const headError = new Error('Cannot get media size.');

  switch (postData.media_type) {
    case 1:
      for (let i = 0; i < postData.image_versions2.candidates.length; i++) {
        const mediaUrl = postData.image_versions2.candidates[i].url;
        const res = await axios.head(mediaUrl);
        if (isString(res.headers['content-length'])) {
          const mediaSize = res.headers['content-length'];
          if (isMediaValidSize(mediaSize)) return [mediaUrl];
        } else throw headError;
      }
      throw sizeError;
    case 2:
      for (let i = 0; i < postData.video_versions.length; i++) {
        const mediaUrl = postData.video_versions[i].url;
        const res = await axios.head(mediaUrl);
        if (isString(res.headers['content-length'])) {
          const mediaSize = res.headers['content-length'];
          if (isMediaValidSize(mediaSize)) return [mediaUrl];
        } else throw headError;
      }
      throw sizeError;
    case 8:
      const mediaUrlArray: string[] = [];
      for (let i = 0; i < postData.carousel_media.length; i++) {
        const mediaItem = postData.carousel_media[i];
        switch (mediaItem.media_type) {
          case 1:
            for (
              let j = 0;
              j < mediaItem.image_versions2.candidates.length;
              j++
            ) {
              const mediaUrl = mediaItem.image_versions2.candidates[j].url;
              const res = await axios.head(mediaUrl);
              if (isString(res.headers['content-length'])) {
                const mediaSize = res.headers['content-length'];
                if (isMediaValidSize(mediaSize)) {
                  mediaUrlArray.push(mediaUrl);
                }
                break;
              } else throw headError;
            }
            break;
          case 2:
            for (let j = 0; j < mediaItem.video_versions.length; j++) {
              const mediaUrl = mediaItem.video_versions[j].url;
              const res = await axios.head(mediaUrl);
              if (isString(res.headers['content-length'])) {
                const mediaSize = res.headers['content-length'];
                if (isMediaValidSize(mediaSize)) mediaUrlArray.push(mediaUrl);
                break;
              } else throw headError;
            }
            break;
          default:
            throw sizeError;
        }
      }
      if (mediaUrlArray.length === 0) throw sizeError;
      return mediaUrlArray;
    default:
      throw sizeError;
  }
};

const igAgent = {
  baseUrl,
  isCookiesValid,
  getIgCookies,
  getPostData,
  mediaUrlArraySelector,
};

export default igAgent;
