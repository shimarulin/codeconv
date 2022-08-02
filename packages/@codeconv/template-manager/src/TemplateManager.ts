import { andThen, clone, mergeDeepRight, pipeWith } from 'ramda'
import { mergeFileLists, readFsThreeList } from './fs/readFsThreeList.js'
import { readFileContentList } from './fs/readFileContentList.js'
import { writeFileDescriptionListTo } from './fs/writeFileDescriptionListTo.js'
import { FileDescription } from './fs/readFileContent'
import { type TemplateData, type TemplateHandler } from './handler/handleFileDescription.js'
import { handleFileDescriptionList } from './handler/handleFileDescriptionList.js'
import { getPathFromStringOrURL } from './path/getPathFromStringOrURL.js'

export type PathOrURL = string | URL

export class TemplateManager {
  private inputDirList: string[] = []
  private outputDir: string | null = null
  private data: TemplateData = {}
  private handlerList: TemplateHandler[] = []
  private inputList: FileDescription[] = []
  private outputList: FileDescription[] = []

  private get isAtLeastOneInputDir (): boolean {
    return this.inputDirList.length > 0
  }

  constructor (inputDirList?: PathOrURL[], outputDir?: string, handlerList?: TemplateHandler[], data?: TemplateData) {
    inputDirList && this.setInputDirList(inputDirList)
    outputDir && this.setOutputDir(outputDir)
    handlerList && this.useHandlerList(handlerList)
    data && this.setData(data)

    return this
  }

  addInputDir (dir: PathOrURL): TemplateManager {
    this.inputDirList.push(getPathFromStringOrURL(dir))

    return this
  }

  addInputDirList (dirList: PathOrURL[]): TemplateManager {
    this.inputDirList.push(...dirList.map((dir) => getPathFromStringOrURL(dir)))

    return this
  }

  setInputDirList (dirList: PathOrURL[]): TemplateManager {
    this.inputDirList = []
    this.addInputDirList(dirList)

    return this
  }

  addFile (file: FileDescription) {
    this.inputList = mergeFileLists<FileDescription>([
      this.inputList,
      [
        file,
      ],
    ])

    return this
  }

  addFileList (fileList: FileDescription[]) {
    this.inputList = mergeFileLists<FileDescription>([
      this.inputList,
      fileList,
    ])

    return this
  }

  useHandler (handler: TemplateHandler): TemplateManager {
    this.handlerList.push(handler)

    return this
  }

  useHandlerList (handlerList: TemplateHandler[]): TemplateManager {
    handlerList.forEach((handler) => {
      this.useHandler(handler)
    })

    return this
  }

  setHandlerList (handlerList: TemplateHandler[]): TemplateManager {
    this.handlerList = [
      ...handlerList,
    ]

    return this
  }

  addData (data: TemplateData): TemplateManager {
    this.data = mergeDeepRight(this.data, data)

    return this
  }

  setData (data: TemplateData): TemplateManager {
    this.data = clone(data)

    return this
  }

  setOutputDir (dir: PathOrURL): TemplateManager {
    this.outputDir = getPathFromStringOrURL(dir)

    return this
  }

  async read (dirs?: PathOrURL | PathOrURL[]) {
    if (dirs) {
      const dirList = Array.isArray(dirs)
        ? [
            ...dirs,
          ]
        : [
            dirs,
          ]

      this.setInputDirList(dirList)
    }

    if (this.isAtLeastOneInputDir) {
      const inputFileList = await pipeWith(andThen, [
        readFsThreeList,
        readFileContentList,
      ])(this.inputDirList)

      this.inputList.push(...inputFileList)
    } else {
      throw new Error('No input directory specified.')
    }

    return this
  }

  handle (handlers?: TemplateHandler | TemplateHandler[], data?: TemplateData) {
    if (handlers) {
      const handlerList = Array.isArray(handlers)
        ? [
            ...handlers,
          ]
        : [
            handlers,
          ]

      this.setHandlerList(handlerList)
    }

    if (data) {
      this.setData(data)
    }

    this.outputList = handleFileDescriptionList(this.handlerList, this.data, this.inputList)

    return this
  }

  async write (dir?: PathOrURL) {
    if (dir) {
      this.setOutputDir(dir)
    }

    if (typeof this.outputDir === 'string' && this.outputDir.length > 0) {
      await writeFileDescriptionListTo(this.outputDir, this.outputList)
    } else {
      throw new Error('No output directory specified.')
    }

    return this
  }
}
