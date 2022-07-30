import { FileMeta } from './readFsThree.js'
import { readFileContent } from './readFileContent.js'

export const readFileContentList = (parsedPathList: FileMeta[]) => Promise
  .all(parsedPathList.map((parsedPath) => readFileContent(parsedPath)))
