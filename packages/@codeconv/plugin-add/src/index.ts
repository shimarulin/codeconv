import { Argv } from 'yargs'

export const command = 'add'
export const describe = 'Add a local package as dependency'

export const builder = {}

export const handler = (argv: Argv): void => {
  console.log('Run command add')
  console.log(argv)
}
