import { format, join } from 'node:path'
import { FileMeta } from './getRecursiveFileList'

export function parsedPathFormat (parsedPath: FileMeta): string {
  return join(parsedPath.root, format(parsedPath))
}
