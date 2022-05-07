import { Arguments, Options } from 'yargs'

export interface CreateCommandArguments {
  pkg?: string;
}

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<CreateCommandArguments>): Promise<void> => {
  console.log(pkg)
}
