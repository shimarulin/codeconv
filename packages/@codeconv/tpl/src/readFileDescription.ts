import { readFile } from 'fs/promises'
import { parsedPathFormat } from './parsedPathFormat.js'
import type { FileMeta } from './getRecursiveFileList'

export interface FileDescription extends FileMeta {
  /**
   * The file content
   */
  content: string;
}

export function readFileDescription (parsedPath: FileMeta): Promise<FileDescription> {
  return readFile(parsedPathFormat(parsedPath), 'utf8')
    .then((content) => {
      return {
        ...parsedPath,
        content,
      }
    })
}

export const readFileDescriptionList = (parsedPathList: FileMeta[]) => Promise
  .all(parsedPathList.map((parsedPath) => readFileDescription(parsedPath)))
