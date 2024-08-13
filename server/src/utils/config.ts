import dotenv from 'dotenv';

dotenv.config();

const envMode = process.env.NODE_ENV || 'development';
const expressPort = process.env.PORT || 3000;
const discordToken = process.env.DISCORD_TOKEN;
const discordAdminUserId = process.env.DISCORD_ADMIN_USER_ID;

const igUser = process.env.IG_USERNAME;
const igPass = process.env.IG_PASSWORD;
const igCredentials =
  igUser && igPass
    ? {
        username: igUser,
        password: igPass,
      }
    : undefined;

interface Proxy {
  protocol: string;
  host: string;
  port: number;
  auth?: { username: string; password: string };
}

const parseProxy = () => {
  const protocol = process.env.IG_PROXY_PROT;
  const host = process.env.IG_PROXY_HOST;
  const port = process.env.IG_PROXY_PORT
    ? parseInt(process.env.IG_PROXY_PORT)
    : undefined;
  const username = process.env.IG_PROXY_USER;
  const password = process.env.IG_PROXY_PASS;

  if (!protocol || !host || !port) return undefined;
  else {
    const proxy: Proxy = {
      protocol: protocol,
      host: host,
      port: port,
    };
    if (username && password) {
      proxy.auth = {
        username: username,
        password: password,
      };
    }
    return proxy;
  }
};

const proxy = parseProxy();

const parseProxyUrl = () => {
  if (!proxy) return undefined;
  const urlParts = [proxy.protocol, '://'];
  if (proxy.auth)
    urlParts.push(proxy.auth.username, ':', proxy.auth.password, '@');
  urlParts.push(proxy.host, ':', proxy.port.toString());
  return urlParts.join('');
};

const proxyUrl = parseProxyUrl();

export {
  envMode,
  expressPort,
  discordToken,
  discordAdminUserId,
  igCredentials,
  proxy,
  proxyUrl,
};
