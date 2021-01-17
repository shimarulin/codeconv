import { Arguments, Options } from 'yargs'

export const command = 'extend'
export const describe = 'Extend an existing package with a functional template'

export const builder: { [key: string]: Options } = {}

export const handler = (argv: Arguments): void => {
  console.log('Run command extend')
  console.log(argv)
}
