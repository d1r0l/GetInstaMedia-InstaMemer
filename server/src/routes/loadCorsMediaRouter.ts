import express from 'express';
import _ from 'lodash';
import axios from 'axios';
import type { RawAxiosResponseHeaders } from 'axios';
import regex from '../utils/regex';

const loadCorsMediaRouter = express.Router();

loadCorsMediaRouter.get('/', (async (req, res) => {
  if (!('query' in req) || !_.isObject(req.query)) {
    res.status(400).send({ error: 'No query provided' });
    return;
  }

  const query = req.query;

  if (!('url' in query) || !_.isString(query.url)) {
    res.status(400).send({ error: 'No url provided' });
    return;
  }

  const url = Buffer.from(query.url, 'base64').toString('ascii');

  if (!regex.igDbLink.test(url)) {
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
    if ('Date' in headers) filtered['Date'] = headers['Date'];
    if ('Connection' in headers) filtered['Connection'] = headers['Connection'];
    if ('Last-Modified' in headers)
      filtered['Last-Modified'] = headers['Last-Modified'];
    if ('Accept-Ranges' in headers)
      filtered['Accept-Ranges'] = headers['Accept-Ranges'];
    if ('Cache-Control' in headers)
      filtered['Cache-Control'] = headers['Cache-Control'];
    if ('Content-Type' in headers)
      filtered['Content-Type'] = headers['Content-Type'];
    return filtered;
  };

  res
    .status(igRes.status)
    .header(filterHeaders(igRes.headers))
    .send(igRes.data);
}) as express.RequestHandler);

export default loadCorsMediaRouter;
