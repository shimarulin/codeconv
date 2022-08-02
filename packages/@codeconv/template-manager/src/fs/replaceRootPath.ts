import { FileDescription } from './readFileContent'

export const replaceRootPath = (targetPath: string, fileList: FileDescription[]) => {
  return fileList.map((file) => ({
    ...file,
    root: targetPath,
  }))
}
