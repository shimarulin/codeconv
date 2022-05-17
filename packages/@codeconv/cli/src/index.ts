import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { CommandModule } from 'yargs'
import { getModuleList, getModuleMetaInfoList } from '@codeconv/packages-resolver'
import { pkgUp } from '@codeconv/context'

// function isNotNullableCommandModule (module: CommandModuleExportDefault | CommandModule | null | undefined): module is CommandModuleExportDefault | CommandModule {
//   return !!module
// }

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

  program.command('$0', 'Select available command from list', {}, async () => {
    /**
     * TODO: Select command from list by 'inquirer'
     * */
    // console.info(`${await program.getHelp()}`)
  })

  const isProjectScope = !!await pkgUp()
  const commandMetaInfoList = await getModuleMetaInfoList([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], isProjectScope ? 'local' : 'global')

  const commandModules = await getModuleList<CommandModule>(commandMetaInfoList)

  commandModules.forEach((commandModule) => {
    if (validateCommandModule(commandModule.module)) {
      program.command(commandModule.module)
    } else {
      // TODO: print module name
      console.error(`Command "${commandModule.manifest.name}" has incompatible format`)
    }
  })

  await program.parse()
}
