import { useState } from 'react'
import { IGItemData } from '../types'
import MediaItem from './MediaItem'
import ImgViewerModal from './ImgViewerModal'
import style from './MediaGrid.module.css'

const MediaGrid = ({ items }: { items: IGItemData[] }): JSX.Element => {
  const [imageVieverIsOpen, setImageVieverIsOpen] = useState(false)
  const [imageVieverUrl, setImageVieverUrl] = useState('')

  return (
    <div className={style.mediaGrid}>
      {items.map(item =>
        item.medias.map(media => (
          <div key={media.url} className={style.mediaGridChild}>
            <MediaItem
              media={media}
              setImageVieverUrl={setImageVieverUrl}
              setImageVieverIsOpen={setImageVieverIsOpen}
            />
            <a
              className={'buttonLike'}
              href={media.url}
              download={media.filename}
            >
              Download
            </a>
          </div>
        ))
      )}
      <ImgViewerModal
        url={imageVieverUrl}
        isOpen={imageVieverIsOpen}
        onClose={() => setImageVieverIsOpen(false)}
      />
    </div>
  )
}

export default MediaGrid
