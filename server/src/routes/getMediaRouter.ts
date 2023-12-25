import express from 'express';
import _ from 'lodash';
import igAgent from '../utils/igAgent';
import regex from '../utils/regex';

const getMediaRouter = express.Router();

getMediaRouter.post('/', (async (req, res) => {
  if (
    'body' in req &&
    _.isObject(req.body) &&
    'payload' in req.body &&
    _.isString(req.body.payload)
  ) {
    const payload = req.body.payload;
    const payloadParts = payload.replace(/\n+/g, ' ').split(' ');
    const links = payloadParts.filter((part) => part.match(/http/));
    const concatMediaUrls = [];
    const undefinedLinks = [];
    if (links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        let linkDefined = false;
        const igLinkMatch = links[i].match(regex.igLink);
        if (igLinkMatch) {
          linkDefined = true;
          const postShortCode = igLinkMatch[1];
          const postData = await igAgent.getPostData(postShortCode);
          const mediaUrlArray = await igAgent.mediaUrlArraySelector(postData);
          if (mediaUrlArray.length === 0)
            throw new Error(`No media found in IG link ${postShortCode}`);
          concatMediaUrls.push(...mediaUrlArray);
        }
        if (!linkDefined) undefinedLinks.push(links[i]);
      }
      if (concatMediaUrls.length > 0) {
        res.status(200).send({
          media: concatMediaUrls,
          ...(undefinedLinks ? { undefinedLinks: undefinedLinks } : {}),
        });
      } else
        res.status(400).send({
          error: 'No media found in payload',
          ...(undefinedLinks ? { undefinedLinks: undefinedLinks } : {}),
        });
    } else {
      res.status(400).send({ error: 'No links in payload found' });
    }
  } else {
    res.status(400).send({ error: 'No payload provided' });
  }
}) as express.RequestHandler);

export default getMediaRouter;
