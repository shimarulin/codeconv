import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type FileDescription } from './readFileContent.js'

export const writeFileDescription = async (file: FileDescription) => {
  const dirPath = join(file.root, file.dir)
  const filePath = join(dirPath, file.base)

  await mkdir(dirPath, {
    recursive: true,
  })
  await writeFile(filePath, file.content)

  return file
}
