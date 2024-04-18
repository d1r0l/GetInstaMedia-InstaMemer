interface Media {
  type: string
  url: string
  filename: string
}

interface IGItemData {
  name: string
  medias: Media[]
}

export type { Media, IGItemData }
