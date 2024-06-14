import express from 'express';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import igAgent from '../../utils/igAgent';
import regex from '../../utils/regex';

const getMediaRouter = express.Router();

getMediaRouter.post('/', (async (req, res) => {
  if (
    !('body' in req) ||
    !isObject(req.body) ||
    !('payload' in req.body) ||
    !isString(req.body.payload)
  ) {
    res.status(400).send({ error: 'No payload provided' });
    return;
  }

  const payload = req.body.payload;
  const payloadParts = payload.replace(/\n+/g, ' ').split(' ');
  const links = payloadParts.filter((part) => part.match(/http/));

  if (links.length === 0) {
    res.status(400).send({ error: 'No links in payload found' });
    return;
  }

  const mediaData: {
    name: string;
    medias: string[];
  }[] = [];
  const undefinedLinks: string[] = [];

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
      mediaData.push({
        name: postShortCode,
        medias: mediaUrlArray,
      });
    }
    if (!linkDefined) undefinedLinks.push(links[i]);
  }

  if (mediaData.length === 0) {
    res.status(400).send({
      error: 'No media found in payload',
      ...(undefinedLinks ? undefinedLinks : {}),
    });
    return;
  }

  res.status(200).send({
    mediaData: mediaData,
    ...(undefinedLinks ? undefinedLinks : {}),
  });
}) as express.RequestHandler);

export default getMediaRouter;
