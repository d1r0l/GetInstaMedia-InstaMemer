import { useState } from 'react'
import _ from 'lodash'
import './App.css'
import axios from 'axios'
import { Media, typeUrlsToMedias } from './types'
import proxyMediaUrl from './utils/proxyMediaUrl'
import { baseUrl } from './config'
import MediaTag from './components/MediaGrid'

function App() {
  const [medias, setMedias] = useState<Media[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      ) {
        const medias = typeUrlsToMedias(res.data.media)
        medias.forEach(m => (m.url = proxyMediaUrl(m.url)))
        setMedias(medias)
      }
    } catch (err) {
      if (err instanceof Error && 'response' in err) console.error(err.response)
      else console.error(err)
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
          {medias.map(m => (
            <MediaTag key={m.url} media={m} />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
