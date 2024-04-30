import { baseUrl } from './config'

const proxyMediaUrl = (url: string) => {
  return `${baseUrl}/api/proxy?url=${btoa(url)}`
}

export default proxyMediaUrl
