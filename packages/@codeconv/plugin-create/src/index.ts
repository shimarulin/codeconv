import { resolve } from 'path'
import { Arguments, Options } from 'yargs'
import { getGitConfig } from '@codeconv/git-config-parser'
import { GitUrlParser } from '@codeconv/git-url-parser'
import { Package, PackageDescriptor, resolvePackages } from '@codeconv/package-resolver'
import { CommandRunner } from '@codeconv/command-runner'
import { licenseMap } from '@codeconv/license'
import { runPrompts, PromptDefaults, PromptOverrides, PromptData } from './runPrompts'
import { runActions } from './runActions'

export interface AddCommandArguments {
  pkg?: string;
}
type GitCommitType = 'init' | 'done'

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  const [
    git,
    packages,
  ] = await Promise.all([
    getGitConfig(),
    resolvePackages(),
  ])
  const rootPkg: PackageDescriptor | undefined = packages.length > 0 ? packages[packages.length - 1] : undefined

  const data: PromptData = {
    namespaces: rootPkg?.manifest.workspaces?.map(workspacePath => {
      const parts = workspacePath
        .replace('/*', '')
        .split('/')
      const ns = parts.pop()
      return ns || ''
    }),
  }
  const overrides: PromptOverrides = {
    type: rootPkg ? 'package' : undefined,
    origin: rootPkg?.manifest?.repository.url || git.remote?.origin.url,
    namespace: Array.isArray(data.namespaces) && data.namespaces.length === 1 ? data.namespaces[0] : undefined,
    // version: '0.1.6',
  }
  const defaults: PromptDefaults = {
    name: pkg,
    author: git.user.name,
    email: git.user.email,
    license: 'MIT',
    version: '1.0.0',
  }

  const answers = await runPrompts(overrides, defaults, data)

  const licenseSource = licenseMap[answers.license]
  const gitUrl = new GitUrlParser(answers.origin)
  const target = rootPkg
    ? resolve(rootPkg?.path, 'packages', answers.namespace, (pkg || answers.name))
    : resolve(process.cwd(), (pkg || answers.name))
  const manifest: Package = {
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
  }
  const year = new Date().getFullYear()
  const license = {
    ...licenseSource,
    licenseText: licenseSource.licenseText
      .replace('<year>', year.toString())
      .replace('<copyright holders>', answers.author),
  }

  await runActions({
    projectType: answers.type,
    license,
    manifest,
  }, target)

  const runner = new CommandRunner(target)
  const isNewProject = answers.type !== 'package'
  const devDependencies: string[] = []

  if (isNewProject) {
    devDependencies.push(
      'husky',
      'lint-staged',
      'eslint',
      '@codeconv/eslint-config-base',
      '@commitlint/cli',
      '@commitlint/config-conventional',
      'format-package',
      'prettier',
    )
  }

  // if (answers.type === 'monorepo') {
  //   devDependencies.push(
  //     '@codeconv/codeconv',
  //     '@codeconv/plugin-create',
  //     '@codeconv/plugin-add',
  //     '@codeconv/plugin-extend',
  //   )
  // }

  const install = async (): Promise<void> => {
    if (devDependencies.length > 0) {
      await runner.exec(`yarn add -D --silent ${[
        ...devDependencies,
      ].join(' ')}`)
    }
  }

  const commit = async (type: GitCommitType): Promise<void> => {
    const gitStatus = await runner.exec('git status --porcelain')
    if (gitStatus.stdout.length > 0) {
      const commitMsgPrefix = `chore${!isNewProject ? `(${manifest.name})` : ''}:`
      const commitMsgHeaders: {[key in GitCommitType]: string} = {
        init: 'init',
        done: `${devDependencies.length > 0 ? 'add development dependencies and' : ''} apply code style`,
      }
      await runner.exec('git add .')
      await runner.exec(`git commit --quiet -m "${commitMsgPrefix} ${commitMsgHeaders[type]}"`)
    }
  }

  isNewProject && await runner.exec('git init --quiet')
  isNewProject && answers.origin && await runner.exec(`git remote add origin ${gitUrl.repository.url}`)
  isNewProject && await commit('init')
  isNewProject && await install()
  await commit(isNewProject ? 'done' : 'init')
}
