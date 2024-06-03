import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';

interface PostBaseData {
  caption: {
    text: string;
  } | null;
  user: {
    username: string;
    full_name: string;
    profile_pic_url: string;
  };
  code: string;
}

interface ImageMedia {
  media_type: 1;
  product_type: 'image';
  image_versions2: {
    candidates: [
      {
        width: number;
        height: number;
        url: string;
      },
    ];
  };
}

interface VideoMedia {
  media_type: 2;
  product_type: 'clips';
  video_versions: [
    {
      width: number;
      height: number;
      url: string;
    },
  ];
  image_versions2: {
    candidates: [
      {
        width: number;
        height: number;
        url: string;
      },
    ];
  };
}

interface CarouselMedia {
  media_type: 8;
  product_type: 'carousel';
  carousel_media_count: number;
  carousel_media: [
    (Omit<ImageMedia, 'product_type'> | Omit<VideoMedia, 'product_type'>) & {
      product_type: 'carousel_item';
    },
  ];
}

type PostMedia = ImageMedia | VideoMedia | CarouselMedia;

export type PostData = PostBaseData & PostMedia;

export const isPostData = (data: unknown): data is PostData => {
  if (
    isObject(data) &&
    'code' in data &&
    isString(data.code) &&
    data.code.length === 11 &&
    'caption' in data &&
    'user' in data &&
    isObject(data.user) &&
    'username' in data.user &&
    isString(data.user.username) &&
    'full_name' in data.user &&
    isString(data.user.full_name) &&
    'profile_pic_url' in data.user &&
    isString(data.user.profile_pic_url) &&
    'media_type' in data &&
    isNumber(data.media_type) &&
    'product_type' in data &&
    isString(data.product_type) &&
    'image_versions2' in data &&
    isObject(data.image_versions2) &&
    'candidates' in data.image_versions2 &&
    isArray(data.image_versions2.candidates) &&
    data.image_versions2.candidates.length > 0
  )
    null;
  else return false;
  switch (data.media_type) {
    case 1:
      if (data.product_type !== 'feed') return false;
      for (let i = 0; i < data.image_versions2.candidates.length; i++) {
        if (
          isObject(data.image_versions2.candidates[i]) &&
          'width' in data.image_versions2.candidates[i] &&
          isNumber(data.image_versions2.candidates[i].width) &&
          'height' in data.image_versions2.candidates[i] &&
          isNumber(data.image_versions2.candidates[i].height) &&
          'url' in data.image_versions2.candidates[i] &&
          isString(data.image_versions2.candidates[i].url)
        )
          null;
        else return false;
      }
      return true;
    case 2:
      if (data.product_type !== 'clips') return false;
      for (let i = 0; i < data.image_versions2.candidates.length; i++) {
        if (
          isObject(data.image_versions2.candidates[i]) &&
          'width' in data.image_versions2.candidates[i] &&
          isNumber(data.image_versions2.candidates[i].width) &&
          'height' in data.image_versions2.candidates[i] &&
          isNumber(data.image_versions2.candidates[i].height) &&
          'url' in data.image_versions2.candidates[i] &&
          isString(data.image_versions2.candidates[i].url)
        )
          null;
        else return false;
      }
      if (
        'video_versions' in data &&
        isArray(data.video_versions) &&
        data.video_versions.length > 0
      )
        null;
      else return false;
      for (let i = 0; i < data.video_versions.length; i++) {
        if (
          isObject(data.video_versions[i]) &&
          'width' in data.video_versions[i] &&
          isNumber(data.video_versions[i].width) &&
          'height' in data.video_versions[i] &&
          isNumber(data.video_versions[i].height) &&
          'url' in data.video_versions[i] &&
          isString(data.video_versions[i].url)
        )
          null;
        else return false;
      }
      return true;
    case 8:
      if (
        data.product_type === 'carousel_container' &&
        'carousel_media' in data &&
        isArray(data.carousel_media) &&
        data.carousel_media.length > 0
      )
        null;
      else return false;
      for (let i = 0; i < data.carousel_media.length; i++) {
        const mediaData = data.carousel_media[i] as unknown;
        if (
          isObject(mediaData) &&
          'media_type' in mediaData &&
          isNumber(mediaData.media_type) &&
          'product_type' in mediaData &&
          mediaData.product_type === 'carousel_item' &&
          'image_versions2' in mediaData &&
          isObject(mediaData.image_versions2) &&
          'candidates' in mediaData.image_versions2 &&
          isArray(mediaData.image_versions2.candidates) &&
          mediaData.image_versions2.candidates.length > 0
        )
          null;
        else return false;
        switch (mediaData.media_type) {
          case 1:
            const imageData = mediaData.image_versions2.candidates;
            for (let j = 0; j < imageData.length; j++) {
              if (
                isObject(imageData[j]) &&
                'width' in imageData[j] &&
                isNumber(imageData[j].width) &&
                'height' in imageData[j] &&
                isNumber(imageData[j].height) &&
                'url' in imageData[j] &&
                isString(imageData[j].url)
              )
                null;
              else return false;
            }
            break;
          case 2:
            const videoPicData = mediaData.image_versions2.candidates;
            for (let j = 0; j < videoPicData.length; j++) {
              if (
                isObject(videoPicData[j]) &&
                'width' in videoPicData[j] &&
                isNumber(videoPicData[j].width) &&
                'height' in videoPicData[j] &&
                isNumber(videoPicData[j].height) &&
                'url' in videoPicData[j] &&
                isString(videoPicData[j].url)
              )
                null;
              else return false;
            }
            if (
              'video_versions' in mediaData &&
              isArray(mediaData.video_versions) &&
              mediaData.video_versions.length > 0
            )
              null;
            else return false;
            for (let j = 0; j < mediaData.video_versions.length; j++) {
              const videoData = mediaData.video_versions[j] as unknown;
              if (
                isObject(videoData) &&
                'width' in videoData &&
                isNumber(videoData.width) &&
                'height' in videoData &&
                isNumber(videoData.height) &&
                'url' in videoData &&
                isString(videoData.url)
              )
                null;
              else return false;
            }
            break;
          default:
            return false;
        }
      }
      return true;
    default:
      return false;
  }
};
