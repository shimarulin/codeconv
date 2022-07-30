import { format, join } from 'node:path'
import { FileMeta } from './readFsThree.js'

export function formatParsedPath (parsedPath: FileMeta): string {
  return join(parsedPath.root, format(parsedPath))
}
