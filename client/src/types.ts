interface Media {
  type: string
  url: string
  filename: string
}

interface IGItemData {
  name: string
  medias: Media[]
}

enum SubmitState {
  error = 0,
  idle = 1,
  loading = 2
}

export type { Media, IGItemData }
export { SubmitState }
