import axios from 'axios';

const baseurl = 'https://www.instagram.com/api/v1';
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Mobile/15E148 Instagram 142.0.0.22.109 ' +
  '(iPhone12,5; iOS 14_1; en_US; en-US; scale=3.00; 1242x2688; 214888322) NW/1';

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null;
};

export const getPublicKeyData = async (): Promise<
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
    isObject(res.data) &&
    'config' in res.data &&
    isObject(res.data.config) &&
    'csrf_token' in res.data.config &&
    isString(res.data.config.csrf_token) &&
    'encryption' in res.data &&
    isObject(res.data.encryption) &&
    'key_id' in res.data.encryption &&
    isString(res.data.encryption.key_id) &&
    'public_key' in res.data.encryption &&
    isString(res.data.encryption.public_key) &&
    'version' in res.data.encryption &&
    isString(res.data.encryption.version)
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
