const extToMime = (extention: string) => {
  switch (extention) {
    case 'jpe':
    case 'jpeg':
    case 'jpg':
    case 'pjpg':
    case 'jfif':
    case 'jfif-tbnl':
    case 'jif':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'heif':
    case 'heic':
      return 'image/heic'
    case 'avif':
    case 'avifs':
      return 'image/avif'
    case 'webp':
      return 'image/webp'
    case 'mp4':
    case 'mp4v':
    case 'mpg4':
      return 'video/mp4'
    default:
      return 'unknown'
  }
}

export default extToMime
