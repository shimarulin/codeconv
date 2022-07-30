import { curry } from 'ramda'
import { type FileDescription } from '../fs/readFileContent'
import { handleFileDescription, type TemplateData, type TemplateHandler } from './handleFileDescription.js'

export const handleFileDescriptionList = (handlers: TemplateHandler[], data: TemplateData, files: FileDescription[]): FileDescription[] => {
  return files.map(curry(handleFileDescription)(handlers, data))
}
