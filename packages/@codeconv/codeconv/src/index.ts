import yargs from 'yargs'
import { getPackageDirs } from '@codeconv/packages-resolver'
import { getContext } from '@codeconv/context'

export const run = async (): Promise<void> => {
  const program = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')

  const context = await getContext()
  const commandDirs = await getPackageDirs([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], context.project ? 'local' : 'global')

  commandDirs.forEach((pluginPath) => {
    program.commandDir(pluginPath, {
      recurse: true,
      extensions: [
        'js',
      ],
      include: new RegExp(`${pluginPath}/(lib|dist)/.*`),
    })
  })

  await program.parse()
}
