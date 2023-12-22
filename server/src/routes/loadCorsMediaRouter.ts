import express from 'express';
import _ from 'lodash';
import axios from 'axios';
import regex from '../utils/regex';

const loadCorsMediaRouter = express.Router();

loadCorsMediaRouter.get('/', (async (req, res) => {
  if ('query' in req && _.isObject(req.query)) {
    const query = req.query;
    if ('url' in query && _.isString(query.url)) {
      const url = Buffer.from(query.url, 'base64').toString('ascii');
      if (regex.igDbLink.test(url)) {
        const igRes = await axios({
          url: url,
          method: 'GET',
          responseType: 'arraybuffer',
        });
        res.status(igRes.status).header(igRes.headers).send(igRes.data);
      } else res.status(400).send({ error: 'Bad url' });
    } else res.status(400).send({ error: 'No url provided' });
  } else res.status(400).send({ error: 'No query provided' });
}) as express.RequestHandler);

export default loadCorsMediaRouter;
