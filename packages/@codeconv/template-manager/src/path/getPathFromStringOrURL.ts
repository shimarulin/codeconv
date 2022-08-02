import { fileURLToPath } from 'url'

export const getPathFromStringOrURL = (url: string | URL) => {
  const isURL = url instanceof URL
  const isFileURLString = typeof url === 'string' && url.search(/^file:/) !== -1

  return isFileURLString || isURL ? fileURLToPath(url) : url
}
