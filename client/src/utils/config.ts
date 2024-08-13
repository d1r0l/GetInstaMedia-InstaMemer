const baseUrl: string = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.BASE_URL

export { baseUrl }
