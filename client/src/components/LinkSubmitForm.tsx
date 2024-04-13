import { baseUrl } from '../config'
import axios from 'axios'
import _ from 'lodash'
import { Media, typeUrlsToMedias } from '../types'
import proxyMediaUrl from '../utils/proxyMediaUrl'
import styles from './LinkSubmitForm.module.css'

const LinkSubmitForm = ({
  setMedias
}: {
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>
}): JSX.Element => {
  const autoSelectText = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.select()
  }

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
    <form
      className={styles.linkSubmitForm}
      action='download'
      method='post'
      onSubmit={handleSubmit}
    >
      <input
        id='payload'
        className={styles.linkSubmitFormInput}
        type='text'
        name='payload'
        autoComplete='off'
        autoFocus={true}
        onFocus={autoSelectText}
      />
      <button className='linkSubmitForm-button' type='submit'>
        Download
      </button>
    </form>
  )
}

export default LinkSubmitForm
