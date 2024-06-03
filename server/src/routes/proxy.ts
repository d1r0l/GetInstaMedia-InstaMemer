import express from 'express';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import axios from 'axios';
import type { RawAxiosResponseHeaders } from 'axios';
import regex from '../utils/regex';

const loadCorsMediaRouter = express.Router();

loadCorsMediaRouter.get('/', (async (req, res) => {
  if (!('query' in req) || !isObject(req.query)) {
    res.status(400).send({ error: 'No query provided' });
    return;
  }

  const query = req.query;

  if (!('url' in query) || !isString(query.url)) {
    res.status(400).send({ error: 'No url provided' });
    return;
  }

  const url = Buffer.from(query.url, 'base64').toString('ascii');

  if (!regex.igDbLink.test(url)) {
    console.log(regex.igDbLink.test(url));
    res.status(400).send({ error: 'Bad url' });
    return;
  }

  const igRes = await axios({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  const filterHeaders = (
    headers: RawAxiosResponseHeaders,
  ): Partial<RawAxiosResponseHeaders> => {
    const filtered: Partial<RawAxiosResponseHeaders> = {};
    if ('date' in headers) filtered.date = headers.date;
    if ('connection' in headers) filtered.connection = headers.connection;
    if ('last-modified' in headers)
      filtered['last-modified'] = headers['last-modified'];
    if ('accept-ranges' in headers)
      filtered['accept-ranges'] = headers['accept-ranges'];
    if ('cache-control' in headers)
      filtered['cache-control'] = headers['cache-control'];
    if ('content-type' in headers)
      filtered['content-type'] = headers['content-type'];
    return filtered;
  };

  res
    .status(igRes.status)
    .header(filterHeaders(igRes.headers))
    .send(igRes.data);
}) as express.RequestHandler);

export default loadCorsMediaRouter;
