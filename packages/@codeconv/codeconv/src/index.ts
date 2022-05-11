import yargs from 'yargs'
import { getPackageDirs, getPackageList } from '@codeconv/packages-resolver'
import { getContext } from '@codeconv/context'

export const run = async (): Promise<void> => {
  const program = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')

  const context = await getContext()
  const commandDirs = await getPackageList([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], context.project ? 'local' : 'global')

  console.log(commandDirs)

  for (const plugin of commandDirs) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { command, describe, builder, handler } = await import(plugin)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    program.command(command, describe, builder, handler)
  }

  // commandDirs.forEach((pluginPath) => {
  //   program.commandDir(pluginPath, {
  //     recurse: true,
  //     extensions: [
  //       'js',
  //     ],
  //     include: new RegExp(`${pluginPath}/(lib|dist)/.*`),
  //   })
  // })

  await program.parse()
}
