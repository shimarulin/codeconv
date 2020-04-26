import { Argv } from 'yargs'

export const command = 'extend'
export const describe = 'Extend an existing package with a functional template'

export const builder = {}

export const handler = (argv: Argv): void => {
  console.log('Run command create')
  console.log(argv)
}
