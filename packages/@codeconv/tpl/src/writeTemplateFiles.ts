import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { FileDescription } from './readFileDescription'

export const writeTemplateFile = async (targetDir:string, file: FileDescription) => {
  const dirPath = join(targetDir, file.dir)
  const filePath = join(dirPath, file.base)

  await mkdir(dirPath, {
    recursive: true,
  })
  await writeFile(filePath, file.content)
}

export const writeTemplateFileList = (targetDir:string, fileList: FileDescription[]) => {
  return Promise.all(fileList.map((file) => writeTemplateFile(targetDir, file)))
}
