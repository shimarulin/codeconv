import yargs from 'yargs'
import * as path from 'path'

export const run = async () => {
  const argv = await yargs(process.argv.slice(2)).argv
  const hasDirNameArg = argv._.length > 0
  const projectPath = hasDirNameArg ? path.resolve(process.cwd(), argv._[0].toString()) : process.cwd()
  const projectDir = path.dirname(projectPath)
  const projectName = path.basename(projectPath)

  console.log('run codeconv create')
  console.dir(projectPath)
  console.dir(projectDir)
  console.dir(projectName)
}
