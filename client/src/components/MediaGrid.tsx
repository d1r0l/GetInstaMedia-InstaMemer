import { Media } from '../types'

const MediaTag = ({ media }: { media: Media }): JSX.Element => {
  switch (media.type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/heic':
    case 'image/avif':
    case 'image/webp':
      return <img src={media.url} crossOrigin='anonymous' width={300} />
    case 'video/mp4':
      return (
        <video controls src={media.url} crossOrigin='anonymous' width={300} />
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
        <span>
          media define failed
          <br />
        </span>
      )
  }
}

export default MediaTag
