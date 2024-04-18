import { IGItemData } from '../types'
import MediaItem from './MediaItem'
import style from './MidiaGrid.module.css'

const MediaGrid = ({ items }: { items: IGItemData[] }): JSX.Element => {
  return (
    <div className={style.mediaGrid}>
      {items.map(item =>
        item.medias.map(media => (
          <div key={media.url} className={style.mediaGridChild}>
            <MediaItem media={media} />
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
    </div>
  )
}

export default MediaGrid
