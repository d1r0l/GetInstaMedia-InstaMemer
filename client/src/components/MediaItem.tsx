import { Media } from '../types'
import styles from './MediaItem.module.css'

interface MediaItemProps {
  media: Media
  setImageVieverUrl: (url: string) => void
  setImageVieverIsOpen: (isOpen: boolean) => void
}

const MediaItem: React.FC<MediaItemProps> = ({
  media,
  setImageVieverUrl,
  setImageVieverIsOpen
}) => {
  const openModal = () => {
    setImageVieverUrl(media.url)
    setImageVieverIsOpen(true)
  }

  const handleImgKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    if (event.key === 'Enter') openModal()
  }

  switch (media.type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/heic':
    case 'image/avif':
    case 'image/webp':
      return (
        <img
          className={styles.mediaItem + ' ' + styles.image}
          src={media.url}
          crossOrigin='anonymous'
          onClick={() => openModal()}
          onKeyDown={handleImgKeyDown}
          tabIndex={0}
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
