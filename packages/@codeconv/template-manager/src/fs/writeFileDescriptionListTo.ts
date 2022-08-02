import { writeFileDescriptionTo } from './writeFileDescriptionTo.js'
import { type FileDescription } from './readFileContent.js'

export const writeFileDescriptionListTo = (targetDir:string, fileList: FileDescription[]) => {
  return Promise.all(fileList.map((file) => writeFileDescriptionTo(targetDir, file)))
}
