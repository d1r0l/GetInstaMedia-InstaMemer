interface Cookies {
  [key: string]: string;
}

const updateCookiesFromSetHeader = (
  rawCookies: string[],
  cookies: Cookies = {},
): {
  [key: string]: string;
} => {
  const newCookies = {
    ...cookies,
  };
  rawCookies.forEach((cookieValues) => {
    const cookie = cookieValues.split('; ')[0];
    const splittedCookie = cookie.split('=');
    const cookieName = splittedCookie[0];
    const cookieValue = splittedCookie[1];
    newCookies[cookieName] = cookieValue;
  });
  return newCookies;
};

const getCookieHeader = (cookies: Cookies): string => {
  let cookieHeader = '';
  for (const [key, value] of Object.entries(cookies)) {
    if (cookieHeader) cookieHeader += '; ';
    cookieHeader += `${key}=${value}`;
  }
  return cookieHeader;
};

export { Cookies, updateCookiesFromSetHeader, getCookieHeader };
