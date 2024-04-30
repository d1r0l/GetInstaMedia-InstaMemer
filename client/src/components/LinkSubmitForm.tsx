import { useState } from 'react'
import { baseUrl } from '../utils/config'
import axios, { AxiosError } from 'axios'
import _ from 'lodash'
import { IGItemData, SubmitState } from '../types'
import StateIndicator from './StateIndicator'
import typeIGItemsData from '../utils/typeIGItemsData'
import styles from './LinkSubmitForm.module.css'

interface LinkSubmitFormProps {
  setItems: React.Dispatch<React.SetStateAction<IGItemData[]>>
}

const LinkSubmitForm: React.FC<LinkSubmitFormProps> = ({ setItems }) => {
  const handleFocus = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.select()
  }
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.idle)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(`submitted payload: ${e.currentTarget.payload.value}`)
    e.preventDefault()
    try {
      setItems([])
      setSubmitState(SubmitState.loading)
      setErrorMessage('')
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
      setSubmitState(SubmitState.idle)
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response &&
        'data' in err.response &&
        _.isObject(err.response.data) &&
        'error' in err.response.data &&
        _.isString(err.response.data.error)
      ) {
        setErrorMessage(err.response.data.error)
        console.error(err.response.data)
      } else console.error(err)
      setSubmitState(SubmitState.error)
    }
  }

  return (
    <>
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
          placeholder='paste post URL here'
          name='payload'
          autoComplete='off'
          required
          autoFocus={true}
          onFocus={handleFocus}
        />
        <button type='submit'>Load Media</button>
      </form>
      <StateIndicator submitState={submitState} errorMessage={errorMessage} />
    </>
  )
}

export default LinkSubmitForm
