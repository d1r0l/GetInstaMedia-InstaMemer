import { IGItemData, Media } from '../types'
import proxyMediaUrl from './proxyMediaUrl'

const typeIGItemsData = (
  itemsData: { name: string; medias: string[] }[]
): IGItemData[] => {
  const typedIGItemsData: IGItemData[] = []
  for (let i = 0; i < itemsData.length; i++) {
    const newItemData: IGItemData = {
      name: itemsData[i].name,
      medias: []
    }
    for (let j = 0; j < itemsData[i].medias.length; j++) {
      const extentionMatch = itemsData[i].medias[j].match(/\.([^/\s]*)\?/i)
      const extention = extentionMatch ? extentionMatch[1].toLowerCase() : ''
      const typedMedia: Media = {
        type: 'unknown',
        url: proxyMediaUrl(itemsData[i].medias[j]),
        filename: itemsData[i].name + '_' + (j + 1) + '.' + extention
      }
      switch (extention) {
        case 'jpe':
        case 'jpeg':
        case 'jpg':
        case 'pjpg':
        case 'jfif':
        case 'jfif-tbnl':
        case 'jif':
          typedMedia.type = 'image/jpeg'
          break
        case 'png':
          typedMedia.type = 'image/png'
          break
        case 'heif':
        case 'heic':
          typedMedia.type = 'image/heic'
          break
        case 'avif':
        case 'avifs':
          typedMedia.type = 'image/avif'
          break
        case 'webp':
          typedMedia.type = 'image/webp'
          break
        case 'mp4':
        case 'mp4v':
        case 'mpg4':
          typedMedia.type = 'video/mp4'
          break
        default:
          break
      }
      newItemData.medias.push(typedMedia)
    }
    typedIGItemsData.push(newItemData)
  }
  return typedIGItemsData
}

export default typeIGItemsData
