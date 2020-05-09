import { resolve } from 'path'
import { Arguments, Options } from 'yargs'
import { getGitConfig } from '@codeconv/git-config-parser'
import { GitUrlParser } from '@codeconv/git-url-parser'
import { resolvePackages } from '@codeconv/package-resolver'
import { licenseMap } from '@codeconv/license'
import { runPrompts, PromptDefaults, PromptOverrides, PromptContext } from './runPrompts'
import { runActions, ActionContext } from './runActions'

export interface AddCommandArguments {
  pkg?: string;
}

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  const year = new Date().getFullYear()
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
    origin: packagesPath.manifest?.repository.url || gitConfig.remote?.origin.url,
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

  const answers = await runPrompts(overrides, defaults, promptContext)

  const license = licenseMap[answers.license]
  const gitUrl = new GitUrlParser(answers.origin)
  const targetPath = packagesPath.root
    ? resolve(packagesPath.root, 'packages', answers.namespace, (pkg || answers.name))
    : resolve(process.cwd(), (pkg || answers.name))

  const actionContext: ActionContext = {
    targetPath,
    manifest: {
      name: answers.namespace ? `${answers.namespace}/${answers.name}` : answers.name,
      version: answers.version,
      description: answers.description,
      license: answers.license,
      private: !answers.publish ? true : undefined,
      publishConfig: answers.publish ? {
        access: 'public',
      } : undefined,
      repository: {
        ...gitUrl.repository,
      },
      bugs: {
        ...gitUrl.bugs,
      },
      homepage: gitUrl.homepage,
      author: `${answers.author} <${answers.email}>`,
    },
    license: {
      ...license,
      licenseText: license.licenseText
        .replace('<year>', year.toString())
        .replace('<copyright holders>', answers.author),
    },
  }

  await runActions(actionContext)
}
