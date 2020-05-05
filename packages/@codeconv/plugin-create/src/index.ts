import { Arguments, Options } from 'yargs'
import { getGitConfig } from '@codeconv/git-config-parser'
import { resolvePackages } from '@codeconv/package-resolver'
import { runPrompts, Defaults, Overrides } from './runPrompts'
// import { runActions } from './runActions'

export interface AddCommandArguments {
  pkg?: string;
}

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  const [
    gitConfig,
    packagesPath,
  ] = await Promise.all([
    getGitConfig(),
    resolvePackages(),
  ])

  const overrides: Overrides = {
    type: packagesPath.root ? 'package' : undefined,
    origin: gitConfig.remote?.origin.url,
    // version: '0.1.6',
  }

  const defaults: Defaults = {
    name: pkg,
    author: gitConfig.user.name,
    email: gitConfig.user.email,
    license: 'MIT',
    version: '1.0.0',
  }

  const answers = await runPrompts(overrides, defaults)
  console.log(answers)
  //
  // await runActions()
  //
}
