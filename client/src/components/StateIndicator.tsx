import { useEffect, useState } from 'react'
import axios from 'axios'
import { SubmitState } from '../types'
import styles from './StateIndicator.module.css'

interface StateIndicatorProps {
  submitState: SubmitState
  errorMessage: string
}

const StateIndicator: React.FC<StateIndicatorProps> = ({
  submitState,
  errorMessage
}) => {
  const [errorImgUrl, setErrorImgUrl] = useState('')

  useEffect(() => {
    const loadErrorImg = async () => {
      try {
        const res = await axios.get('./error.svg', { responseType: 'blob' })
        setErrorImgUrl(URL.createObjectURL(res.data))
      } catch (error) {
        console.error(error)
      }
    }
    loadErrorImg()
  }, [])

  switch (submitState) {
    case SubmitState.error:
      return (
        <div className={styles.stateContainer}>
          <div className={styles.errorContainer}>
            <img
              className={styles.errorIcon}
              src={errorImgUrl}
              alt='Error Icon'
            />
            <p className={styles.errorMessage}>{errorMessage}</p>
          </div>
        </div>
      )
    case SubmitState.loading:
      return (
        <div className={styles.stateContainer}>
          <div className={styles.loading}></div>
        </div>
      )
    case SubmitState.idle:
    default:
      return null
  }
}

export default StateIndicator
