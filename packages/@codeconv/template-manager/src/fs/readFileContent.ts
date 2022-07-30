import { readFile } from 'fs/promises'
import { parsedPathToAbsolutePath } from '../path/parsedPathToAbsolutePath.js'
import type { FileMeta } from './readFsThree.js'

export interface FileDescription extends FileMeta {
  /**
   * The file content
   */
  content: string;
}

export const readFileContent = async (parsedPath: FileMeta): Promise<FileDescription> => {
  const content = await readFile(parsedPathToAbsolutePath(parsedPath), 'utf8')
  return {
    ...parsedPath,
    content,
  }
}
