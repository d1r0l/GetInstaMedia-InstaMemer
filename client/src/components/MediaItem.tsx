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
    default:
      return (
        <div className={styles.unknownItem}>
          <span className={styles.unknownItemSpan}>Unknown Media</span>
        </div>
      )
  }
}

export default MediaItem
