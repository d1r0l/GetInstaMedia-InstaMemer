import { baseUrl } from '../config'
import axios from 'axios'
import _ from 'lodash'
import { IGItemData } from '../types'
import typeIGItemsData from '../utils/typeIGItemsData'
import styles from './LinkSubmitForm.module.css'

const LinkSubmitForm = ({
  setItems
}: {
  setItems: React.Dispatch<React.SetStateAction<IGItemData[]>>
}): JSX.Element => {
  const handleFocus = (e: React.FormEvent<HTMLInputElement>) => {
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
        'mediaData' in res.data &&
        _.isArray(res.data.mediaData)
      ) {
        const mediaData = typeIGItemsData(res.data.mediaData)
        setItems(mediaData)
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
        onFocus={handleFocus}
      />
      <button type='submit'>Load Media</button>
    </form>
  )
}

export default LinkSubmitForm
