import { IGItemData, Media } from '../types'
import { baseUrl } from './config'
import axios from 'axios'
import extToMime from './extToMime'
import { baseUrl } from './config'
import axios from 'axios'
import extToMime from './extToMime'

const typeIGItemsData = async (
const typeIGItemsData = async (
  itemsData: { name: string; medias: string[] }[]
): Promise<IGItemData[]> => {
  const fetchBlobUrl = async (url: string) => {
    try {
      const res = await axios.get(`${baseUrl}/api/proxy`, {
        responseType: 'blob',
        params: { url: btoa(url) }
      })
      return URL.createObjectURL(res.data)
    } catch (error) {
      console.error(error)
      return ''
    }
  }

): Promise<IGItemData[]> => {
  const fetchBlobUrl = async (url: string) => {
    try {
      const res = await axios.get(`${baseUrl}/api/proxy`, {
        responseType: 'blob',
        params: { url: btoa(url) }
      })
      return URL.createObjectURL(res.data)
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  const typedIGItemsData: IGItemData[] = []
  for await (const item of itemsData) {
  for await (const item of itemsData) {
    const newItemData: IGItemData = {
      name: item.name,
      name: item.name,
      medias: []
    }
    for await (const media of item.medias) {
      const extMatch = media.match(/\.([^/\s]*)\?/i)
      const extention = extMatch ? extMatch[1].toLowerCase() : ''
    for await (const media of item.medias) {
      const extMatch = media.match(/\.([^/\s]*)\?/i)
      const extention = extMatch ? extMatch[1].toLowerCase() : ''
      const typedMedia: Media = {
        type: extToMime(extention),
        url: await fetchBlobUrl(media),
        filename:
          item.name + '_' + (item.medias.indexOf(media) + 1) + '.' + extention
      }
      newItemData.medias.push(typedMedia)
    }
    typedIGItemsData.push(newItemData)
  }
  return typedIGItemsData
}

export default typeIGItemsData
