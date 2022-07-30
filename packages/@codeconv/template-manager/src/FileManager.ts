import { fileURLToPath } from 'url'
import { andThen, clone, curry, pipeWith } from 'ramda'
import { readFsThreeList } from './fs/readFsThreeList.js'
import { readFileContentList } from './fs/readFileContentList.js'
import { writeFileDescriptionList } from './fs/writeFileDescriptionList.js'
import { type TemplateData, type TemplateHandler } from './handler/handleFileDescription.js'
import { handleFileDescriptionList } from './handler/handleFileDescriptionList.js'

export type PathOrURL = string | URL

export class FileManager {
  private inputDirList: string[] = []
  private outputDir: string | null = null
  private data: TemplateData = {}
  private handlerList: TemplateHandler[] = []

  private get hasOutputDir (): boolean {
    return typeof this.outputDir === 'string' && this.outputDir.length > 0
  }

  private get isAtLeastOneInputDir (): boolean {
    return this.inputDirList.length > 0
  }

  private get isValid (): boolean {
    if (!this.isAtLeastOneInputDir) {
      throw new Error('No input directory specified.')
    }

    if (!this.hasOutputDir) {
      throw new Error('No output directory specified')
    }

    return this.isAtLeastOneInputDir && this.hasOutputDir
  }

  constructor (inputDirList?: PathOrURL[], outputDir?: string, handlerList?: TemplateHandler[], data?: TemplateData) {
    inputDirList && this.readFromDirList(inputDirList)
    outputDir && this.writeToDir(outputDir)
    handlerList && this.useHandlerList(handlerList)
    data && this.setData(data)
  }

  readFromDir (dir: PathOrURL): FileManager {
    this.inputDirList.push(fileURLToPath(dir))

    return this
  }

  readFromDirList (dirList: PathOrURL[]): FileManager {
    dirList.forEach((dir) => {
      this.readFromDir(dir)
    })

    return this
  }

  useHandler (handler: TemplateHandler): FileManager {
    this.handlerList.push(handler)

    return this
  }

  useHandlerList (handlerList: TemplateHandler[]): FileManager {
    handlerList.forEach((handler) => {
      this.useHandler(handler)
    })

    return this
  }

  setData (data: TemplateData): FileManager {
    this.data = clone(data)

    return this
  }

  writeToDir (dir: PathOrURL): FileManager {
    this.outputDir = fileURLToPath(dir)

    return this
  }

  process () {
    if (this.isValid) {
      const handleFileDescriptionListWithData = curry(handleFileDescriptionList)(this.handlerList, this.data || {})
      const writeFileDescriptionListToDir = curry(writeFileDescriptionList)(this.outputDir || '')

      return pipeWith(andThen, [
        readFsThreeList,
        // filter
        readFileContentList,
        // append files
        handleFileDescriptionListWithData,
        writeFileDescriptionListToDir,
      ])(this.inputDirList)
    }
  }
}
