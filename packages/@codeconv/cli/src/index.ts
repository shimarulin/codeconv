import inquirer from 'inquirer'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { CommandModule } from 'yargs'
import { resolveModuleList } from '@codeconv/packages-resolver'
import { pkgUp } from '@codeconv/context'

// TODO: pass validator to resolveModuleList
// const validateCommandModule = (commandModule: CommandModule): boolean => {
//   // TODO: print module name and err message
//   // console.error('Command has incompatible format')
//   return ('command' in commandModule && typeof commandModule.command === 'string') &&
//     ('describe' in commandModule && typeof commandModule.describe === 'string') &&
//     'builder' in commandModule &&
//     'handler' in commandModule
// }

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
    program.command(commandModule)
  })

  program.command('$0', 'Select available command from list', {}, async (args) => {
    const helpCommandName = 'help'

    await inquirer
      .prompt<{ command: string }>([
        {
          name: 'command',
          message: 'Select command',
          type: 'list',
          choices: commandModules
            .map((commandModule) => commandModule.command)
            .concat([
              helpCommandName,
            ]),
        },
      ])
      .then((answers) => {
        if (answers.command === helpCommandName) {
          program.showHelp()
        }

        return commandModules
          .find((commandModule) => commandModule.command === answers.command)
      })
      .then((selectedCommandModule) => {
        return selectedCommandModule && selectedCommandModule.handler(args)
      })
  })

  await program.parse()
}
