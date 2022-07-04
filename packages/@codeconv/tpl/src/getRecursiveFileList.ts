import { join, extname, basename } from 'node:path'
import { opendir } from 'node:fs/promises'
import { fileURLToPath } from 'url'

/**
 * This interface is similar to ParsedPath from 'node:path',
 * but differs in the representation of the "root" and "dir" properties
 * */
export interface FileMeta {
  /**
   * The full path to the template directory such as '/home/user/dir'
   */
  root: string;
  /**
   * Path to the directory containing the file, relative to the template directory such as './src/common'
   */
  dir: string;
  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base: string;
  /**
   * The file extension (if any) such as '.html'
   */
  ext: string;
  /**
   * The file name without extension (if any) such as 'index'
   */
  name: string;
}

export async function getRecursiveFileList (url: string | URL, relativeDirPath?: string): Promise<FileMeta[]> {
  const root = typeof url === 'string' ? url : fileURLToPath(url)
  const currentDir = relativeDirPath ? join(root, relativeDirPath) : root
  const fileList: FileMeta[] = []

  try {
    const dir = await opendir(currentDir)
    for await (const dirent of dir) {
      const relativePath = typeof relativeDirPath === 'string' ? join(relativeDirPath, dirent.name) : dirent.name

      if (dirent.isFile()) {
        const ext = extname(dirent.name)

        fileList.push({
          root,
          dir: relativeDirPath ? `./${relativeDirPath}` : './',
          base: dirent.name,
          ext,
          name: basename(dirent.name, ext),
        })
      } else if (dirent.isDirectory()) {
        fileList.push(...await getRecursiveFileList(root, relativePath))
      }
    }
  } catch (err) {
    console.error(err)
  }

  return fileList
}
