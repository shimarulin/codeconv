import yargs from 'yargs'
import { resolveCommandDirs } from '@codeconv/packages-resolver'

export const run = async (): Promise<void> => {
  const programm = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')

  const commandDirs = await resolveCommandDirs([
    '@codeconv/plugin',
    'codeconv-plugin',
  ])

  console.log(programm.argv)

  // plugins.forEach((pluginPath) => {
  //   yargs.commandDir(pluginPath, {
  //     recurse: true,
  //     extensions: dev
  //       ? [
  //           'ts',
  //         ]
  //       : [
  //           'js',
  //         ],
  //     include: new RegExp(`${pluginPath}/${dev ? 'src' : '(lib|dist)'}/.*`),
  //   })
  // })
  //
  // await yargs.parse()
}
