import { Arguments, Options } from 'yargs'

export const command = 'release'
export const describe = 'Make project release'

export const builder: { [key: string]: Options } = {}

export const handler = (argv: Arguments): void => {
  console.log('Run command release')
  console.log(argv)
}
