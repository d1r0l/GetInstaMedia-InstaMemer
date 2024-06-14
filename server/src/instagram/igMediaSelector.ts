import type MediaInfoResponseItems from './igPostDataType';
import axios from 'axios';
import { isString } from 'lodash';

const igMediaSelector = async (
  MediaItems: MediaInfoResponseItems[],
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

  const mediaUrlArray: string[] = [];
  for (let i = 0; i < MediaItems.length; i++) {
    const MediaItem = MediaItems[i];
    switch (MediaItem.media_type) {
      case 1:
        for (let i = 0; i < MediaItem.image_versions2.candidates.length; i++) {
          const mediaUrl = MediaItem.image_versions2.candidates[i].url;
          const res = await axios.head(mediaUrl);
          if (isString(res.headers['content-length'])) {
            const mediaSize = res.headers['content-length'];
            if (isMediaValidSize(mediaSize)) {
              mediaUrlArray.push(mediaUrl);
              return mediaUrlArray;
            }
          } else throw headError;
        }
        throw sizeError;
      case 2:
        for (let i = 0; i < MediaItem.video_versions.length; i++) {
          const mediaUrl = MediaItem.video_versions[i].url;
          const res = await axios.head(mediaUrl);
          if (isString(res.headers['content-length'])) {
            const mediaSize = res.headers['content-length'];
            if (isMediaValidSize(mediaSize)) {
              mediaUrlArray.push(mediaUrl);
              return mediaUrlArray;
            }
          } else throw headError;
        }
        throw sizeError;
      case 8:
        for (let i = 0; i < MediaItem.carousel_media.length; i++) {
          const mediaItem = MediaItem.carousel_media[i];
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
  }
  throw new Error('No media found.');
};

export default igMediaSelector;
