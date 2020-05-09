import { resolve, extname } from 'path'
import { majo, Majo } from 'majo'
import { render } from 'ejs'
import { License } from '@codeconv/license'
import { Package, PKG_FILE_NAME } from '@codeconv/package-resolver'

export interface ActionContext {
  targetPath: string;
  license: License;
  manifest: Package;
}

/**
 * Remove double underscore from file name (used for config files)
 * */
const unescape = (stream: Majo): void => {
  stream.fileList.forEach((filePath) => {
    filePath.search(/__/) !== -1 && stream.rename(filePath, filePath.replace('__', ''))
  })
}

const renderPackageJson = (stream: Majo): void => {
  const contents = JSON.parse(stream.fileContents(PKG_FILE_NAME))
  stream.writeContents(PKG_FILE_NAME, JSON.stringify({
    ...contents,
    ...stream.meta.manifest,
  }, null, 2))
}

const transform = (stream: Majo): void => {
  stream.fileList.forEach((relativePath) => {
    const ext = extname(relativePath)
    if (ext === '.ejs') {
      const contents = stream.files[relativePath].contents.toString()
      stream.writeContents(relativePath, render(contents, stream.meta))
      stream.rename(relativePath, relativePath.replace(ext, ''))
    }
  })
}

export const runActions = async (context: ActionContext): Promise<Majo> => {
  const stream = majo()

  return stream
    .source('*', {
      baseDir: resolve(__dirname, '../template'),
    })
    .use((s) => {
      s.meta = {
        ...context,
      }
    })
    .use(unescape)
    .use(transform)
    .use(renderPackageJson)
    .dest(context.targetPath)
}
