import { Media } from '../types'
import styles from './MediaItem.module.css'

const MediaItem = ({ media }: { media: Media }): JSX.Element => {
  switch (media.type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/heic':
    case 'image/avif':
    case 'image/webp':
      return (
        <img
          className={styles.mediaItem}
          src={media.url}
          crossOrigin='anonymous'
        />
      )
    case 'video/mp4':
      return (
        <video
          controls
          className={styles.mediaItem}
          src={media.url}
          crossOrigin='anonymous'
        />
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
        <div className={styles.mediaItem}>
          <span>Can't display media</span>
        </div>
      )
  }
}

export default MediaItem
