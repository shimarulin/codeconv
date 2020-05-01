import { prompt } from 'inquirer'
import { Arguments, Options } from 'yargs'
import { getWorkspace } from 'ultra-runner/lib/workspace'
import { PackageJsonWithRoot, getPackage, findUp } from 'ultra-runner/lib/package'
import { yellow, green } from 'chalk'

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

/**
 * Add Package pkg-b to pkg-a
 * For TypeScript:
 *
 * Add to 'pkg-b/tsconfig.json'
 "compilerOptions": {
    "composite": true
  },
 *
 * Add to 'pkg-a/tsconfig.json'
 "references": [{
    "path": "../pkg-b/tsconfig.json"
  }]
 * */

export const handler = async ({ pkg, to }: Arguments<{pkg?: string; to?: string}>): Promise<void> => {
  const workspace = await getWorkspace()
  const currentPath = findUp('package.json')
  const currentPackage = getPackage(currentPath || process.cwd())
  const rootPackage = getPackage(workspace?.root || process.cwd())
  const packages = workspace ? Array.from(workspace.packages.values()) : []
  const packageChoices = packages
    .map(({ name }) => name)
    .sort()

  const getPackageDefs = (pkgName: string | undefined): PackageJsonWithRoot | undefined =>
    pkgName ? packages.find(({ name }) => name === pkgName) : undefined
  const getNotFoundPrefix = (condition: boolean, pkgName: string | undefined): string =>
    condition && pkgName ? `${yellow(`Package "${pkgName}" not found.`)}\n${green('└')} ` : ''
  const getSelfInstallPrefix = (condition: boolean, pkgName?: string): string =>
    condition ? `${yellow(`Can't install ${pkgName ? `the package "${pkgName}"` : 'a package'} as a recursive dependency.`)}\n${green('└')} ` : ''

  const argumentSource = getPackageDefs(pkg)
  const argumentTarget = getPackageDefs(to) || (to === rootPackage?.name ? rootPackage : undefined)
  const isSame = argumentSource?.name === currentPackage?.name
  const source = !isSame ? argumentSource : undefined
  const target = to ? argumentTarget : currentPackage

  const answers: AddCommandAnswers = await prompt([
    {
      type: 'list',
      name: 'source',
      message: `${getNotFoundPrefix(!isSame, pkg)}${getSelfInstallPrefix(isSame, pkg)}Select the package to be add:`,
      choices (): string[] {
        return isSame
          ? packageChoices.filter(item => item !== argumentSource?.name)
          : packageChoices.filter(item => item !== target?.name)
      },
      when: !source,
    },
    {
      type: 'list',
      name: 'target',
      message: `${getNotFoundPrefix(true, to)}Select the target package:`,
      choices (answers): string[] {
        return packageChoices.filter(item => item !== answers.source && item !== source?.name)
      },
      when: !target,
    },
  ])

  const resolvedPackages: AddCommandPackages = {
    source: source || getPackageDefs(answers.source),
    target: target || getPackageDefs(answers.target),
  }

  console.log('Run command add')
  console.log(resolvedPackages.source?.name, resolvedPackages.target?.name)
}
