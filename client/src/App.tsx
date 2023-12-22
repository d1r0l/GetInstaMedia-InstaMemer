import { useState } from 'react'
import _ from 'lodash'
import './App.css'
import axios from 'axios'

const baseUrl = 'http://localhost:3000'

const getProxyMediaUrl = (url: string) => {
  return `${baseUrl}/api/proxy?url=${btoa(url)}`
}

interface Media {
  type: string
  url: string
}

function App() {
  const [media, setMedia] = useState<Media[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const getTypedMediaArray = (mediaArray: string[]): Media[] => {
      const definedMediaArray = [] as Media[]
      for (let i = 0; i < mediaArray.length; i++) {
        switch (true) {
          case !!mediaArray[i].match(
            /\.(?:jpe|jpeg|jpg|pjpg|jfif|jfif-tbnl|jif)\?/i
          ):
            definedMediaArray.push({
              type: 'image/jpeg',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
          case !!mediaArray[i].match(/\.(?:png)\?/i):
            definedMediaArray.push({
              type: 'image/png',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
          case !!mediaArray[i].match(/\.(?:heif|heic)\?/i):
            definedMediaArray.push({
              type: 'image/heic',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
          case !!mediaArray[i].match(/\.(?:avif|avifs)\?/i):
            definedMediaArray.push({
              type: 'image/avif',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
          case !!mediaArray[i].match(/\.(?:webp)\?/i):
            definedMediaArray.push({
              type: 'image/webp',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
          case !!mediaArray[i].match(/\.(?:mp4|mp4v|mpg4)\?/i):
            definedMediaArray.push({
              type: 'video/mp4',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
          default:
            definedMediaArray.push({
              type: 'unknown',
              url: getProxyMediaUrl(mediaArray[i])
            })
            break
        }
      }
      return definedMediaArray
    }

    console.log(`submitted payload: ${e.currentTarget.payload.value}`)
    e.preventDefault()
    try {
      const res = await axios.post(`${baseUrl}/api/getMedia`, {
        payload: e.currentTarget.payload.value
      })
      if (
        'data' in res &&
        _.isObject(res.data) &&
        'media' in res.data &&
        _.isArray(res.data.media)
      )
        setMedia(getTypedMediaArray(res.data.media))
    } catch (err) {
      if (err instanceof Error && 'response' in err) console.error(err.response)
      else console.error(err)
    }
  }

  const MediaGrid = ({ media }: { media: Media }): JSX.Element => {
    switch (media.type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/heic':
      case 'image/avif':
      case 'image/webp':
        return <img src={media.url} crossOrigin='anonymous' width={300} />
      case 'video/mp4':
        return (
          <video controls src={media.url} crossOrigin='anonymous' width={300} />
        )
      case 'unknown':
        return (
          <span>
            <a href={media.url} target='_blank'>
              Unknown Media
            </a>
          </span>
        )
      default:
        return (
          <span>
            media define failed
            <br />
          </span>
        )
    }
  }

  return (
    <>
      <h1>sm_downloader</h1>
      <div>
        <form action='download' method='post' onSubmit={handleSubmit}>
          <input
            type='text'
            name='payload'
            size={100}
            autoComplete='off'
            autoFocus={true}
          />
          <input type='submit' value='Download' />
        </form>
        <div>
          {media.map(m => (
            // <p>{m.url}</p>
            <MediaGrid key={m.url} media={m} />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
