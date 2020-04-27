import { prompt } from 'enquirer'
import { Arguments, Options } from 'yargs'

interface AddAnswers {
  source: string;
  target: string;
}

export const command = 'add [module]'
export const describe = 'Add a local package as dependency'

export const builder: { [key: string]: Options } = {
  to: {
    description: 'Set the target package',
    type: 'string',
  },
}

export const handler = async ({ module, to }: Arguments<{module?: string; to?: string}>): Promise<void> => {
  console.log(module, to)

  const answers: AddAnswers = await prompt([
    {
      type: 'select',
      name: 'source',
      message: 'Select the module to be add',
      choices: [
        'a',
        'b',
        'c',
      ],
    },
    {
      type: 'select',
      name: 'target',
      message: 'Select the target module',
      format (value: string): string | Promise<string> {
        console.log(value)
        return value === '#00ffff' ? 'aqua---' : value
      },
      choices: [
        {
          name: '#00ffff',
          message: 'aqua---',
          hint: '---aqua',
        },
        {
          name: '#000000',
          message: 'black---',
          hint: '---black',
        },
        {
          name: '#0000ff',
          message: 'blue---',
          hint: '---blue',
        },
        {
          name: '#ff00ff',
          message: 'fuchsia---',
          hint: '---fuchsia',
        },
      ],
      // skip: true,
    },
  ])
  console.log('Run command add')
  console.log(answers)
}
