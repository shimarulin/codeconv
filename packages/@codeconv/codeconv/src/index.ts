import yargs from 'yargs'
import { resolveCommandDirs } from '@codeconv/packages-resolver'
import { getContext } from '@codeconv/context'

export const run = async (): Promise<void> => {
  const program = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')

  const context = getContext()

  console.log(context)

  const commandDirs = await resolveCommandDirs([
    '@codeconv/plugin',
    'codeconv-plugin',
  ])

  console.log(commandDirs, program.argv)

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
