import { reduce } from 'ramda'
import { type FileDescription } from '../fs/readFileContent.js'

export interface TemplateData {
  [key: string]: string | number | boolean | string[] | number[] | TemplateData
}

export interface TemplateHandler {
  (template: FileDescription, data: TemplateData): FileDescription
}

export const handleFileDescription = (handlers: TemplateHandler[], data: TemplateData, file: FileDescription) => {
  return reduce<TemplateHandler, FileDescription>((acc, handler) => handler(acc, data), file)(handlers)
}
