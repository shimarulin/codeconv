import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type FileDescription } from './readFileContent.js'

export const writeFileDescription = async (targetDir:string, file: FileDescription) => {
  const dirPath = join(targetDir, file.dir)
  const filePath = join(dirPath, file.base)

  await mkdir(dirPath, {
    recursive: true,
  })
  await writeFile(filePath, file.content)

  return file
}
