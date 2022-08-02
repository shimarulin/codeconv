import { pipe, andThen, pipeWith, curry, map, filter, reduce } from 'ramda'
import { getRecursiveFileList } from './getRecursiveFileList.js'
import { readFileDescriptionList } from './readFileDescription.js'
import { writeTemplateFileList } from './writeTemplateFiles.js'
import type { FileMeta } from './getRecursiveFileList'
import type { FileDescription } from './readFileDescription'

export interface TemplateData {
  [key: string]: string | number | boolean | string[] | number[] | TemplateData
}

export interface TemplateHandler {
  (template: FileDescription, data: TemplateData): FileDescription
}

export type TemplateInput = string | URL | (string | URL)[]

export interface TemplateInputOptions {
  /**
   * Template directory path or array of paths to template directories
   * */
  input: TemplateInput
  /**
   * Output path
   * */
  output: string
  /**
   * Template render data
   * */
  data: TemplateData
  /**
   * Template file handlers
   * */
  handlers: TemplateHandler[]
}

const mergeTemplateFileLists = reduce<FileMeta[], FileMeta[]>((acc, val) => {
  acc.push(...val)

  return acc
}, [])

const getTemplateFiles = (templateInputs: (string | URL)[]) => Promise
  .all(templateInputs.map((url) => getRecursiveFileList(url)))
  .then(mergeTemplateFileLists)

const normalizeTemplateInput = (input: TemplateInput) => {
  return Array.isArray(input)
    ? [
        ...input,
      ]
    : [
        input,
      ]
}

const handleFileDescriptionList = (handlers: TemplateHandler[], data: TemplateData, files: FileDescription[]): FileDescription[] => {
  return files.map((file) => {
    return reduce<TemplateHandler, FileDescription>((acc, handler) => handler(acc, data), file)(handlers)
  })
}

export const tpl = (options: TemplateInputOptions) => {
  const curriedHandler = curry(handleFileDescriptionList)(options.handlers, options.data)
  const curriedWrite = curry(writeTemplateFileList)(options.output)

  return pipe(
    normalizeTemplateInput,
    getTemplateFiles,
    andThen(readFileDescriptionList),
    andThen(curriedHandler),
    andThen(curriedWrite),
  )(options.input)
}
