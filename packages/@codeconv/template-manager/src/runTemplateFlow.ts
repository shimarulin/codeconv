import { andThen, curry, pipeWith } from 'ramda'
import { readFsThreeList } from './fs/readFsThreeList.js'
import { readFileContentList } from './fs/readFileContentList.js'
import { replaceRootPath } from './fs/replaceRootPath'
import { writeFileDescriptionList } from './fs/writeFileDescriptionList'
import { type TemplateData, type TemplateHandler } from './handler/handleFileDescription.js'
import { handleFileDescriptionList } from './handler/handleFileDescriptionList.js'
import { getPathListFromStringOrURLList } from './path/getPathListFromStringOrURLList'

export const runTemplateFlow = (inputDirList: (string | URL)[], handlerList: TemplateHandler[], data: TemplateData, outputDir: string) => {
  const input = getPathListFromStringOrURLList(inputDirList)
  const applyHandlers = curry(handleFileDescriptionList)(handlerList, data)
  const setOutputDir = curry(replaceRootPath)(outputDir)

  return pipeWith(andThen, [
    readFsThreeList,
    readFileContentList,
    applyHandlers,
    setOutputDir,
    writeFileDescriptionList,
  ])(input)
}
