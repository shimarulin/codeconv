import { prompt } from 'inquirer'
import { Arguments, Options } from 'yargs'
import { getWorkspace } from 'ultra-runner/lib/workspace'
import { PackageJsonWithRoot } from 'ultra-runner/lib/package'

interface AddCommandAnswers {
  source?: string;
  target?: string;
}

interface AddCommandPackages {
  source?: PackageJsonWithRoot;
  target?: PackageJsonWithRoot;
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
  const getPackageDefs = (pkgName: string | undefined): PackageJsonWithRoot | undefined =>
    pkgName ? packages.find(({ name }) => name === pkgName) : undefined

  const source = getPackageDefs(pkg)
  const target = getPackageDefs(to)

  const answers: AddCommandAnswers = await prompt([
    {
      type: 'list',
      name: 'source',
      message: `${pkg ? `Package ${pkg} not found.\n└ ` : ''}Select the package to be add:`,
      choices: packageChoices,
      when: !source,
    },
    {
      type: 'list',
      name: 'target',
      message: `${to ? `Package ${to} not found.\n  ` : ''}Select the target package:`,
      choices (answers): string[] {
        return packageChoices.filter(item => item !== answers.source && item !== source?.name)
      },
      when: !target,
    },
  ])

  const resolvedPackages: AddCommandPackages = {
    source: source || getPackageDefs(answers.source),
    target: source || getPackageDefs(answers.target),
  }

  console.log('Run command add')
  console.log(resolvedPackages)
}
