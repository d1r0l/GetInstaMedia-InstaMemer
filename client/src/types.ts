interface Media {
  type: string
  url: string
}

const typeUrlsToMedias = (mediaArray: string[]): Media[] => {
  const definedMediaArray = [] as Media[]
  for (let i = 0; i < mediaArray.length; i++) {
    switch (true) {
      case !!mediaArray[i].match(
        /\.(?:jpe|jpeg|jpg|pjpg|jfif|jfif-tbnl|jif)\?/i
      ):
        definedMediaArray.push({
          type: 'image/jpeg',
          url: mediaArray[i]
        })
        break
      case !!mediaArray[i].match(/\.(?:png)\?/i):
        definedMediaArray.push({
          type: 'image/png',
          url: mediaArray[i]
        })
        break
      case !!mediaArray[i].match(/\.(?:heif|heic)\?/i):
        definedMediaArray.push({
          type: 'image/heic',
          url: mediaArray[i]
        })
        break
      case !!mediaArray[i].match(/\.(?:avif|avifs)\?/i):
        definedMediaArray.push({
          type: 'image/avif',
          url: mediaArray[i]
        })
        break
      case !!mediaArray[i].match(/\.(?:webp)\?/i):
        definedMediaArray.push({
          type: 'image/webp',
          url: mediaArray[i]
        })
        break
      case !!mediaArray[i].match(/\.(?:mp4|mp4v|mpg4)\?/i):
        definedMediaArray.push({
          type: 'video/mp4',
          url: mediaArray[i]
        })
        break
      default:
        definedMediaArray.push({
          type: 'unknown',
          url: mediaArray[i]
        })
        break
    }
  }
  return definedMediaArray
}

export type { Media }
export { typeUrlsToMedias }
