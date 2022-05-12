import type { ArgumentsCamelCase, CommandModule } from 'yargs'

export interface CreateCommandArguments {
  name?: string;
}

const commandModule: CommandModule = {
  command: 'create [name]',
  describe: 'Create standard project or package from template',
  builder: {},
  handler: (args: ArgumentsCamelCase<CreateCommandArguments>) => {
    console.log(args)
  },
}

export default commandModule
