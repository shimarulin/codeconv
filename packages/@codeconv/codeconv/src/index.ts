import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { CommandModule } from 'yargs'
import { getPackageList } from '@codeconv/packages-resolver'
import { getContext } from '@codeconv/context'

export const run = async (): Promise<void> => {
  const program = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')

  program.command('$0', 'Print this message', {}, async (argv) => {
    console.info(`${await program.getHelp()}`)
  })

  const context = await getContext()
  const commandModuleNames = await getPackageList([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], context.project ? 'local' : 'global')

  const commandModules = await Promise.all(commandModuleNames.map((commandModuleName) => {
    return import(commandModuleName) as Promise<CommandModule>
  }))

  commandModules.forEach((commandModule) => {
    program.command(commandModule)
  })

  await program.parse()
}
