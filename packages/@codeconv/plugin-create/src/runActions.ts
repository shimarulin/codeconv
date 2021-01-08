import { resolve, extname } from 'path'
import { majo, Majo } from 'majo'
import { render } from 'ejs'
import { License } from '@codeconv/license'
import { Package, PKG_FILE_NAME } from '@codeconv/package-resolver'
import { ProjectType } from './runPrompts'
import * as fs from 'fs'
import * as path from 'path'

export interface ActionData {
  projectType: ProjectType;
  license: License;
  manifest: Package;
}

/**
 * Remove double underscore from file name (used for config files)
 * */
const unescapeFileNames = (stream: Majo): void => {
  stream.fileList.forEach((filePath) => {
    filePath.search(/__/) !== -1 && stream.rename(filePath, filePath.replace('__', ''))
  })
}

const renderPackageJson = (stream: Majo): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const contents = JSON.parse(stream.fileContents(PKG_FILE_NAME))
  stream.writeContents(PKG_FILE_NAME, JSON.stringify({
    ...contents,
    ...stream.meta.manifest,
  }, null, 2))
}

const renderTemplates = (stream: Majo): void => {
  stream.fileList.forEach((relativePath) => {
    const ext = extname(relativePath)
    if (ext === '.ejs') {
      const contents = stream.files[relativePath].contents.toString()
      stream.writeContents(relativePath, render(contents, stream.meta))
      stream.rename(relativePath, relativePath.replace(ext, ''))
    }
  })
}

export const runActions = async (data: ActionData, target: string): Promise<Majo> => {
  const stream = majo()

  return stream
    .source('**/*', {
      baseDir: resolve(__dirname, '../template'),
    })
    .use((s) => {
      s.meta = {
        ...data,
      }
    })
    .filter(filepath => {
      return data.projectType !== 'package' || filepath.search(/^__\./) === -1
    })
    .use(unescapeFileNames)
    .use(renderTemplates)
    .use(renderPackageJson)
    .dest(target)
    .then(instance => {
      setImmediate(() => {
        for (const filePath in instance.files) {
          filePath.search(/hooks/) !== -1 && fs.chmod(path.resolve(target, filePath), 0o755, (err) => {
            if (err) throw err
          })
        }
      })
      return instance
    })
}
