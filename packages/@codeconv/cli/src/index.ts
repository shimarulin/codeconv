import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { CommandModule } from 'yargs'
import { getPackageList } from '@codeconv/packages-resolver'
import { getContext } from '@codeconv/context'

interface CommandModuleExportDefault {
  default: CommandModule
}

const validateCommandModule = (commandModule: CommandModuleExportDefault | CommandModule): boolean => {
  return ('command' in commandModule && typeof commandModule.command === 'string') &&
    ('describe' in commandModule && typeof commandModule.describe === 'string') &&
    'builder' in commandModule &&
    'handler' in commandModule
}

export const run = async (): Promise<void> => {
  const program = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')

  program.command('$0', 'Print this message', {}, async () => {
    console.info(`${await program.getHelp()}`)
  })

  const context = await getContext()
  const commandModuleNames = await getPackageList([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], context.project ? 'local' : 'global')

  const commandModules = await Promise.all(commandModuleNames.map((commandModuleName) => {
    return import(commandModuleName) as Promise<CommandModuleExportDefault | CommandModule>
  }))

  commandModules.forEach((commandModuleStructure, index) => {
    const commandModule = 'default' in commandModuleStructure ? commandModuleStructure.default : commandModuleStructure

    if (validateCommandModule(commandModule)) {
      program.command(commandModule)
    } else {
      console.error(`Validate module "${commandModuleNames[index]}" failed`)
    }
  })

  await program.parse()
}
