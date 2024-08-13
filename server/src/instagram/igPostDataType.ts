import type { MediaInfoResponseItemsItem } from 'instagram-private-api/dist/responses/media.repository.info.response';

interface MediaInfoResponseItemsImage extends MediaInfoResponseItemsItem {
  media_type: 1;
}

interface MediaInfoResponseItemsVideo extends MediaInfoResponseItemsItem {
  media_type: 2;
  video_versions: {
    url: string;
    type?: number;
    width?: number;
    height?: number;
    id?: string;
  }[];
}

interface MediaInfoResponseItemsCarousel extends MediaInfoResponseItemsItem {
  media_type: 8;
  carousel_media: (MediaInfoResponseItemsImage | MediaInfoResponseItemsVideo)[];
}

type MediaInfoResponseItems =
  | MediaInfoResponseItemsImage
  | MediaInfoResponseItemsVideo
  | MediaInfoResponseItemsCarousel;

export default MediaInfoResponseItems;
