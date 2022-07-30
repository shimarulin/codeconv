import { readFile } from 'fs/promises'
import { formatParsedPath } from './formatParsedPath.js'
import type { FileMeta } from './readFsThree.js'

export interface FileDescription extends FileMeta {
  /**
   * The file content
   */
  content: string;
}

export const readFileContent = async (parsedPath: FileMeta): Promise<FileDescription> => {
  const content = await readFile(formatParsedPath(parsedPath), 'utf8')
  return {
    ...parsedPath,
    content,
  }
}
