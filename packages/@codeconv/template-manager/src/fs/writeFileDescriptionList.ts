import { writeFileDescription } from './writeFileDescription.js'
import { type FileDescription } from './readFileContent.js'

export const writeFileDescriptionList = (targetDir:string, fileList: FileDescription[]) => {
  return Promise.all(fileList.map((file) => writeFileDescription(targetDir, file)))
}