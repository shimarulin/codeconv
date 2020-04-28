import { prompt } from 'inquirer'
import { Arguments, Options } from 'yargs'
import { getWorkspace } from 'ultra-runner/lib/workspace'

interface AddAnswers {
  source?: string;
  target?: string;
}

export const command = 'add [pkg]'
export const describe = 'Add a local package as dependency'

export const builder: { [key: string]: Options } = {
  to: {
    description: 'Set the target package',
    type: 'string',
  },
}

export const handler = async ({ pkg, to }: Arguments<{pkg?: string; to?: string}>): Promise<void> => {
  const workspace = await getWorkspace()
  const packages = workspace ? Array.from(workspace.packages.values()) : []
  const packageChoices = packages
    .map(({ name }) => name)

  const answers: AddAnswers = await prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select the package to be add:',
      choices: packageChoices,
    },
    {
      type: 'list',
      name: 'target',
      message: 'Select the target package:',
      choices (answers): string[] {
        return packageChoices.filter(item => item !== answers.source)
      },
    },
  ])

  console.log('Run command add')
  console.log(answers)
}
