import { getPathFromStringOrURL } from './getPathFromStringOrURL'

export const getPathListFromStringOrURLList = (inputDirList: (string | URL)[]) => {
  return inputDirList.map(getPathFromStringOrURL)
}
