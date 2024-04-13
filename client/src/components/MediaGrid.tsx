import { Media } from '../types'
import MediaItem from './MediaItem'

const MediaGrid = ({ medias }: { medias: Media[] }): JSX.Element => {
  return (
    <div>
      {medias.map(m => (
        <MediaItem key={m.url} media={m} />
      ))}
    </div>
  )
}

export default MediaGrid
