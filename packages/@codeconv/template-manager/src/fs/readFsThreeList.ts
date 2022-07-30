import { reduce } from 'ramda'
import { type FileMeta, readFsThree } from './readFsThree.js'

const mergeFileLists = reduce<FileMeta[], FileMeta[]>((acc, val) => {
  acc.push(...val)

  return acc
}, [])

export const readFsThreeList = (pathList: string[]) => Promise
  .all(pathList.map((url) => readFsThree(url)))
  .then(mergeFileLists)
