import { Argv } from 'yargs'

export const command = 'create'
export const describe = 'Create standard project or package from template'

export const builder = {}

export const handler = (argv: Argv): void => {
  console.log('Run command create')
  console.log(argv)
}
