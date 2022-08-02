import { format, join } from 'node:path'
import { FileMeta } from '../fs/readFsThree.js'

export function parsedPathToAbsolutePath (parsedPath: FileMeta): string {
  return join(parsedPath.root, format(parsedPath))
}
