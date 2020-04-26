import { Argv } from 'yargs'

export const command = 'release'
export const describe = 'Make project release'

export const builder = {}

export const handler = (argv: Argv): void => {
  console.log('Run command release')
  console.log(argv)
}
