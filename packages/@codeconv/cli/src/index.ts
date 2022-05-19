import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { CommandModule } from 'yargs'
import { resolveModuleList } from '@codeconv/packages-resolver'
import { pkgUp } from '@codeconv/context'

const validateCommandModule = (commandModule: CommandModule): boolean => {
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

  const isProjectScope = !!await pkgUp()

  const commandModules = await resolveModuleList<CommandModule>([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], !isProjectScope)

  commandModules.forEach((commandModule) => {
    if (validateCommandModule(commandModule)) {
      program.command(commandModule)
    } else {
      // TODO: print module name
      console.error('Command has incompatible format')
    }
  })

  program.command('$0', 'Select available command from list', {}, async () => {
    /**
     * TODO: Select command from list by 'inquirer'
     * */
    // console.info(`${await program.getHelp()}`)
  })

  await program.parse()
}
