import { Arguments, Options } from 'yargs'
import { questionnaire } from './questionnaire'

export interface AddCommandArguments {
  pkg?: string;
}

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  console.log('Run command create')
  console.log(pkg)

  const answers = await questionnaire()

  console.log(answers)
}
