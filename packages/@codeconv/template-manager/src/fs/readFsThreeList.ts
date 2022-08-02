import { join } from 'node:path'
import { reduce } from 'ramda'
import { type FileMeta, readFsThree } from './readFsThree.js'
import { type FileDescription } from './readFileContent.js'

export const mergeFileLists = <T extends FileMeta | FileDescription>(list: T[][]) => reduce<T[], T[]>((acc, val) => {
  val.forEach((toMergeFileItem) => {
    const duplicatedFileItem = acc.find((existedFileItem) =>
      existedFileItem.base === toMergeFileItem.base && existedFileItem.dir === toMergeFileItem.dir,
    )

    if (duplicatedFileItem) {
      throw new Error(`File '${join(toMergeFileItem.dir, toMergeFileItem.base)}' from template directory ${toMergeFileItem.root} already exist in ${duplicatedFileItem.root}. You can't write more than one file to the same target path`)
    }
  })

  acc.push(...val)

  return acc
}, [])(list)

export const readFsThreeList = (pathList: string[]): Promise<FileMeta[]> => Promise
  .all(pathList.map((url) => readFsThree(url)))
  .then(mergeFileLists<FileMeta>)
