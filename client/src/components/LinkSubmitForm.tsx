import { useState } from 'react'
import { baseUrl } from '../utils/config'
import axios, { AxiosError } from 'axios'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import { IGItemData, SubmitState } from '../types'
import StateIndicator from './StateIndicator'
import typeIGItemsData from '../utils/typeIGItemsData'
import styles from './LinkSubmitForm.module.css'

interface LinkSubmitFormProps {
  items: IGItemData[]
  setItems: React.Dispatch<React.SetStateAction<IGItemData[]>>
}

const LinkSubmitForm: React.FC<LinkSubmitFormProps> = ({ items, setItems }) => {
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.idle)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleFocus = (e: React.FormEvent<HTMLInputElement>) =>
    e.currentTarget.select()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    items.forEach(item =>
      item.medias.forEach(media => URL.revokeObjectURL(media.url))
    )
    setItems([])
    setSubmitState(SubmitState.loading)
    setErrorMessage('')
    try {
      const res = await axios.post(`${baseUrl}/api/getMedia`, {
        payload: e.currentTarget.payload.value
      })
      if (
        'data' in res &&
        isObject(res.data) &&
        'mediaData' in res.data &&
        isArray(res.data.mediaData)
      ) {
        const mediaData = await typeIGItemsData(res.data.mediaData)
        setItems(mediaData)
        setSubmitState(SubmitState.idle)
      } else {
        setSubmitState(SubmitState.error)
      }
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response &&
        'data' in err.response &&
        isObject(err.response.data) &&
        'error' in err.response.data &&
        isString(err.response.data.error)
      ) {
        setErrorMessage(err.response.data.error)
        console.error(err.response.data)
      } else {
        setErrorMessage('Something went wrong. Please try again later.')
        console.error(err)
      }
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
