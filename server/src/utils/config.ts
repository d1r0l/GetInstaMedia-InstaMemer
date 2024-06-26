import dotenv from 'dotenv';
import { isString, isNumber } from 'lodash';

dotenv.config();

const envMode = process.env.NODE_ENV || 'development';
const expressPort = process.env.PORT || 3000;
const discordToken = process.env.DISCORD_TOKEN;

const getIgCredentials = () => {
  const igUser = process.env.IG_USERNAME;
  const igPass = process.env.IG_PASSWORD;

  if (isString(igUser) && isString(igPass))
    return {
      username: igUser,
      password: igPass,
    };
  else return undefined;
};

const igCredentials = getIgCredentials();

const getProxy = () => {
  const proxyProt = process.env.IG_PROXY_PROT;
  const proxyHost = process.env.IG_PROXY_HOST;
  const proxyPort = process.env.IG_PROXY_PORT;
  const proxyUser = process.env.IG_PROXY_USER;
  const proxyPass = process.env.IG_PROXY_PASS;

  if (
    isString(proxyProt) &&
    isString(proxyHost) &&
    isNumber(proxyPort) &&
    isString(proxyUser) &&
    isString(proxyPass)
  )
    return {
      protocol: proxyProt,
      host: proxyHost,
      port: proxyPort,
      auth: {
        username: proxyUser,
        password: proxyPass,
      },
    };
  else return undefined;
};

const axiosProxy = getProxy();

const getProxyUrl = () => {
  if (axiosProxy) {
    const proxyUrl =
      axiosProxy.protocol +
      '://' +
      axiosProxy.auth.username +
      ':' +
      axiosProxy.auth.password +
      '@' +
      axiosProxy.host +
      ':' +
      axiosProxy.port;
    return proxyUrl;
  } else return undefined;
};

const proxyUrl = getProxyUrl();

export {
  envMode,
  expressPort,
  discordToken,
  igCredentials,
  axiosProxy,
  proxyUrl,
};
