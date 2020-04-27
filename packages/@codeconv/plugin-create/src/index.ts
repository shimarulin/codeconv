import { Arguments, Options } from 'yargs'

export const command = 'create'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = (argv: Arguments): void => {
  console.log('Run command create')
  console.log(argv)
}
