import { Arguments, Options } from 'yargs'
import { getGitConfig } from '@codeconv/git-config-parser'
import { resolvePackages } from '@codeconv/package-resolver'
import { runPrompts, PromptDefaults, PromptOverrides, PromptContext } from './runPromptsInq'
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

  const promptContext: PromptContext = {
    namespaces: packagesPath.manifest?.workspaces?.map(workspacePath => {
      const parts = workspacePath
        .replace('/*', '')
        .split('/')
      const ns = parts.pop()
      return ns || ''
    }),
  }

  const overrides: PromptOverrides = {
    type: packagesPath.root ? 'package' : undefined,
    origin: gitConfig.remote?.origin.url,
    namespace: Array.isArray(promptContext.namespaces) && promptContext.namespaces.length === 1 ? promptContext.namespaces[0] : undefined,
    // version: '0.1.6',
  }
  const defaults: PromptDefaults = {
    name: pkg,
    author: gitConfig.user.name,
    email: gitConfig.user.email,
    license: 'MIT',
    version: '1.0.0',
  }
  // console.log(packagesPath)

  const answers = await runPrompts(overrides, defaults, promptContext)
  console.log(answers)
  //
  // await runActions()
  //
}
